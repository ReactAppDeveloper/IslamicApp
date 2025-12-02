const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Subscription = require("../models/Subscription");

// STEP 1 — SetupIntent
const createSetupIntent = async (req, res) => {
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

    // Create SetupIntent
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

// STEP 2 — Create Subscription
const createSubscription = async (req, res) => {
  try {
    const { customerId, priceId, email, paymentMethodId } = req.body;

    if (!paymentMethodId) {
      return res.status(400).json({ error: "Payment method is required" });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId }
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    // Save or update in DB
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id },
      {
        email: email,
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
      status: subscription.status,
    });

  } catch (err) {
    console.log("Subscription Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// STEP 3 — Webhook
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
    console.log("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "invoice.paid": {
      const invoice = event.data.object;

      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        {
          status: "active",
          currentPeriodEnd: invoice.period_end,
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

    case "customer.subscription.updated": {
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
      console.log("Unhandled event:", event.type);
  }

  res.json({ received: true });
};

module.exports = {
  createSetupIntent,
  createSubscription,
  handleWebhook,
};
