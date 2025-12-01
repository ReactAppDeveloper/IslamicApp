const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Subscription = require("../models/Subscription");

/**
 * STEP 1 → Create SetupIntent
 * This is called BEFORE the user uses PaymentSheet.
 * PaymentSheet will save the card and attach a default payment method.
 */
const createSetupIntent = async (req, res) => {
  try {
    const { email } = req.body;

    // 🔍 Find or create customer
    let customer;
    const existing = await stripe.customers.list({ email, limit: 1 });

    if (existing.data.length > 0) {
      customer = existing.data[0];
    } else {
      customer = await stripe.customers.create({ email });
    }

    // 🎯 Create SetupIntent so user can save card
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
    });

    res.json({
      customerId: customer.id,
      clientSecret: setupIntent.client_secret,
    });

  } catch (err) {
    console.log("SetupIntent Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};


/**
 * STEP 2 → Create Subscription
 * Called AFTER user completes PaymentSheet successfully.
 */
const createSubscription = async (req, res) => {
  try {
    const { customerId, priceId, email } = req.body;

    // 🔍 Retrieve customer to check if card is attached
    const customer = await stripe.customers.retrieve(customerId);

    const defaultPaymentMethod =
      customer.invoice_settings.default_payment_method;

    if (!defaultPaymentMethod) {
      return res.status(400).json({
        error: "Customer has no default payment method. SetupIntent must be completed first.",
      });
    }

    // 🎯 Create subscription using saved card
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
    });

    // 💾 Save subscription in MongoDB
    await Subscription.create({
      email: email || customer.email,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      priceId,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });

    res.json({
      subscriptionId: subscription.id,
      status: subscription.status,
    });

  } catch (err) {
    console.log("Subscription Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};


/**
 * STEP 3 → Stripe Webhook
 * Handles status updates: invoice.paid, subscription canceled, etc.
 */
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
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  switch (event.type) {
    case "invoice.paid": {
      const invoice = event.data.object;

      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        {
          status: "active",
          currentPeriodEnd: invoice.lines.data[0].period.end,
        }
      );
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        { status: "past_due" }
      );
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;

      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        { status: "canceled" }
      );
      break;
    }

    default:
      console.log("Unhandled event type:", event.type);
  }

  res.json({ received: true });
};

module.exports = {
  createSetupIntent,
  createSubscription,
  handleWebhook,
};
