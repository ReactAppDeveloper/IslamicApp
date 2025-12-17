const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const PRICE_IDS = {
  monthly: process.env.PRICE_MONTHLY_ID,
  yearly: process.env.PRICE_YEARLY_ID,
};

exports.createMobileSubscription = async (req, res) => {
  try {
    const { email, plan } = req.body;

    if (!plan || !PRICE_IDS[plan]) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.verified) return res.status(403).json({ message: "Email not verified" });

    // Create Stripe customer if missing
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user._id.toString() },
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const priceId = PRICE_IDS[plan];

    // Create SetupIntent for PaymentSheet
    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeCustomerId,
      payment_method_types: ["card"],
      usage: "off_session",
    });

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: user.stripeCustomerId },
      { apiVersion: "2025-08-27.basil" }
    );

    res.json({
      success: true,
      setupIntentClientSecret: setupIntent.client_secret,
      customerId: user.stripeCustomerId,
      customerEmail: user.email,
      ephemeralKey: ephemeralKey.secret,
      priceId,
      planType: plan,
    });
  } catch (err) {
    console.error("Mobile Subscription Error:", err);
    res.status(500).json({ message: "Error creating mobile subscription" });
  }
};

exports.retrieveSetupIntent = async (req, res) => {
  try {
    const { clientSecret } = req.body;
    if (!clientSecret) return res.status(400).json({ message: "Missing clientSecret" });

    // Extract SetupIntent ID from client_secret
    const setupIntentId = clientSecret.split("_secret")[0];
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

    res.json({
      paymentMethodId: setupIntent.payment_method,
    });
  } catch (err) {
    console.error("Retrieve SetupIntent Error:", err);
    res.status(500).json({ message: "Failed to retrieve SetupIntent" });
  }
};

exports.completeSubscription = async (req, res) => {
  try {
    const { email, priceId, paymentMethodId } = req.body;
    if (!email || !priceId || !paymentMethodId)
      return res.status(400).json({ message: "Missing required fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Attach payment method if not already attached
    const existingPMs = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: "card",
    });

    const alreadyAttached = existingPMs.data.some(pm => pm.id === paymentMethodId);
    if (!alreadyAttached) {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: user.stripeCustomerId });
    }

    // Set as default payment method
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    const pm = await stripe.paymentMethods.retrieve(paymentMethodId);

    await stripe.customers.update(user.stripeCustomerId, {
      name: pm.billing_details.name || user.name,
      phone: pm.billing_details.phone || undefined,
      address: pm.billing_details.address || undefined,
      description: `Subscribed via ${priceId === PRICE_IDS.yearly ? "Yearly" : "Monthly"} Plan`,
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: user.stripeCustomerId,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
      payment_behavior: "allow_incomplete",
    });

    const paymentIntent = subscription.latest_invoice?.payment_intent;
    const isPaid = paymentIntent && paymentIntent.status === "succeeded";

    // Save minimal info now; full period info will come from webhook
    user.subscriptionId = subscription.id;
    user.isSubscriber = isPaid;
    user.subscriptionStatus = isPaid ? "active" : subscription.status;
    user.planType = priceId === PRICE_IDS.yearly ? "yearly" : "monthly";
    user.lastPaymentAmount = paymentIntent?.amount_received || 0;

    // currentPeriodEnd is unknown until payment succeeds
    user.currentPeriodEnd = null;

    await user.save();

    console.log('Subscription created:', subscription.id);

    res.json({
      success: true,
      isSubscriber: user.isSubscriber,
      subscriptionStatus: user.subscriptionStatus,
      currentPeriodEnd: user.currentPeriodEnd, // null for now, updated by webhook
    });
  } catch (err) {
    console.error("Complete Subscription Error:", err);
    res.status(500).json({ message: "Subscription creation failed" });
  }
};

exports.webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
     case "invoice.payment_succeeded": {
  const invoice = event.data.object;
  const user = await User.findOne({ stripeCustomerId: invoice.customer });
  if (!user) break;

  // Mark user as active subscriber
  user.isSubscriber = true;
  user.subscriptionStatus = "active";

  let periodStart = null;
  let periodEnd = null;

  // ✅ Use invoice period fields if available
  if (invoice.current_period_start && invoice.current_period_end) {
    periodStart = new Date(invoice.current_period_start * 1000);
    periodEnd = new Date(invoice.current_period_end * 1000);
    user.currentPeriodEnd = invoice.current_period_end; // Save in DB
  }

  // Retrieve subscription for plan type and subscription ID
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription, {
      expand: ["items.data.plan"]
    });
    const item = subscription.items.data[0];
    user.planType = item?.plan?.interval === "year" ? "yearly" : "monthly";
    user.subscriptionId = subscription.id;
  }

  // ✅ Update last payment amount
  if (invoice.amount_paid) {
    user.lastPaymentAmount = invoice.amount_paid; // in cents
  }

  await user.save();
  console.log('User currentPeriodEnd from invoice:', user.currentPeriodEnd);

  // ✅ Send invoice email if available
  if (invoice.hosted_invoice_url) {
    const amountPaid = (invoice.amount_paid / 100).toFixed(2);
    const currency = invoice.currency.toUpperCase();
    const invoiceUrl = invoice.hosted_invoice_url;

    const emailHtml = `
      <div style="font-family:Arial,sans-serif; background:#f5f5f5; padding:20px;">
        <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
          <div style="background:#DAA520; padding:20px; text-align:center; color:#fff;">
            <h2 style="margin:0;">Wasil App</h2>
            <p style="margin:0; font-size:16px;">Subscription Invoice</p>
          </div>
          <div style="padding:25px;">
            <p>Assalamu Alaikum <strong>${user.name}</strong>,</p>
            <p>Your subscription payment has been successfully received.</p>
            <table style="width:100%; margin-top:15px; border-collapse:collapse;">
              <tr>
                <td style="padding:10px; border:1px solid #ddd;"><strong>Amount Paid</strong></td>
                <td style="padding:10px; border:1px solid #ddd;">${amountPaid} ${currency}</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #ddd;"><strong>Plan</strong></td>
                <td style="padding:10px; border:1px solid #ddd; text-transform:capitalize;">Subscription ${user.planType || "N/A"}</td>
              </tr>
              ${
                periodStart && periodEnd
                  ? `<tr>
                      <td style="padding:10px; border:1px solid #ddd;"><strong>Subscription Period</strong></td>
                      <td style="padding:10px; border:1px solid #ddd;">${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()}</td>
                    </tr>`
                  : ""
              }
            </table>
            <div style="margin-top:20px; text-align:center;">
              <a href="${invoiceUrl}" style="background:#DAA520; color:white; padding:12px 20px; border-radius:5px; text-decoration:none; font-weight:bold; display:inline-block;">
                Download Invoice
              </a>
            </div>
            <p style="margin-top:25px;">Thank you for supporting Wasil App.</p>
            <p style="margin-top:20px; font-size:13px; color:#666;">If you have any questions, contact support.</p>
          </div>
          <div style="background:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#777;">
            © ${new Date().getFullYear()} Wasil App — All Rights Reserved.
          </div>
        </div>
      </div>
    `;

    await sendEmail(user.email, "Wasil App – Your Subscription Invoice", emailHtml, true);
    console.log("📧 Invoice sent to:", user.email);
  }

  break;
}

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const user = await User.findOne({ stripeCustomerId: invoice.customer });
        if (user) {
          user.subscriptionStatus = "past_due";
          await user.save();
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const user = await User.findOne({ stripeCustomerId: sub.customer });
        if (user) {
          user.isSubscriber = false;
          user.subscriptionStatus = "canceled";
          user.currentPeriodEnd = sub.current_period_end;
          await user.save();
        }
        break;
      }

      default:
        console.log(`⚠ Unhandled event type ${event.type}`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook handler failed:", err);
    res.status(500).send("Webhook Error");
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    if (!subscriptionId) return res.status(400).json({ message: "Subscription ID required" });

    const deleted = await stripe.subscriptions.del(subscriptionId);
    res.json({ success: true, deleted });
  } catch (err) {
    console.error("Cancel subscription error:", err);
    res.status(500).json({ message: "Failed to cancel subscription" });
  }
};

exports.checkSubscriptionByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const now = Math.floor(Date.now() / 1000);

    const isActiveSubscriber =
      user.isSubscriber === true &&
      user.subscriptionStatus === "active" &&
      user.currentPeriodEnd &&
      user.currentPeriodEnd > now;

    if (!isActiveSubscriber && user.isSubscriber === true) {
      user.isSubscriber = false;
      user.subscriptionStatus = "expired";
      await user.save();
    }

    return res.json({
      success: true,
      isSubscriber: isActiveSubscriber,
      planType: isActiveSubscriber ? user.planType : null,
      subscriptionStatus: isActiveSubscriber ? "active" : "inactive",
    });
  } catch (err) {
    console.error("Check subscription error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to check subscription",
    });
  }
};