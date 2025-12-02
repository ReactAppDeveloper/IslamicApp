const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Subscription = require("../models/Subscription");

// ✅ Generate ephemeral key for PaymentSheet
const createEphemeralKey = async (req, res) => {
  try {
    const { email } = req.body;

    // Find or create customer
    let customer;
    const existing = await stripe.customers.list({ email, limit: 1 });
    if (existing.data.length > 0) {
      customer = existing.data[0];
    } else {
      customer = await stripe.customers.create({ email });
    }

    // Create ephemeral key for PaymentSheet
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2025-08-19" } // make sure this matches Stripe SDK version
    );

    res.json({
      customerId: customer.id,
      ephemeralKey: ephemeralKey.secret,
    });
  } catch (err) {
    console.log("Ephemeral Key Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create subscription
const createSubscription = async (req, res) => {
  try {
    const { customerId, paymentMethodId, priceId } = req.body;

    if (!paymentMethodId)
      return res.status(400).json({ error: "PaymentMethod ID is required" });

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    // Set as default
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
      payment_behavior: "default_incomplete",
    });

    // Save to DB
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id },
      {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        priceId,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      { upsert: true }
    );

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      status: subscription.status,
    });
  } catch (err) {
    console.log("Subscription Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Webhook
const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "invoice.paid":
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: event.data.object.subscription },
        { status: "active", currentPeriodEnd: event.data.object.period_end }
      );
      break;
    case "invoice.payment_failed":
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: event.data.object.subscription },
        { status: "past_due" }
      );
      break;
    case "customer.subscription.updated":
      const sub = event.data.object;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        {
          status: sub.status,
          currentPeriodEnd: sub.current_period_end,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        }
      );
      break;
    case "customer.subscription.deleted":
      const deleted = event.data.object;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: deleted.id },
        { status: "canceled" }
      );
      break;
    default:
      console.log("Unhandled event:", event.type);
  }

  res.json({ received: true });
};

module.exports = {
  createEphemeralKey,
  createSubscription,
  handleWebhook,
};
