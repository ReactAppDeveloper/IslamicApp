const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Subscription = require("../models/Subscription");

// Create subscription
const createSubscription = async (req, res) => {
  try {
    const { email, priceId } = req.body;

    // 1️⃣ Create Stripe customer
    const customer = await stripe.customers.create({ email });

    // 2️⃣ Create subscription
    let subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    // Ensure payment intent exists
    if (!subscription.latest_invoice.payment_intent) {
      const latestInvoice = await stripe.invoices.retrieve(subscription.latest_invoice.id, {
        expand: ["payment_intent"],
      });
      subscription.latest_invoice.payment_intent = latestInvoice.payment_intent;
    }

    // 3️⃣ Save to MongoDB
    await Subscription.create({
      email,
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      priceId,
      status: "incomplete",
    });

    res.json(subscription);
  } catch (err) {
    console.error("Create subscription error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Handle Stripe webhook
const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log("Webhook error:", err.message);
    return res.sendStatus(400);
  }

  switch (event.type) {
    case "invoice.paid":
      const invoice = event.data.object;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        { status: "active" }
      );
      break;

    case "customer.subscription.deleted":
      const subscriptionDeleted = event.data.object;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscriptionDeleted.id },
        { status: "canceled" }
      );
      break;

    default:
      console.log("Unhandled event type:", event.type);
  }

  res.sendStatus(200);
};

module.exports = { createSubscription, handleWebhook };
