const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create subscription
const createSubscription = async (req, res) => {
  try {
    const { email, priceId } = req.body;

    // 1️⃣ Create Stripe customer
    const customer = await stripe.customers.create({ email });

    // 2️⃣ Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    res.json(subscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Handle Stripe webhook
const handleWebhook = (req, res) => {
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
      console.log("Invoice paid:", event.data.object);
      // TODO: update DB to mark subscription active
      break;
    case "customer.subscription.deleted":
      console.log("Subscription canceled:", event.data.object);
      // TODO: update DB to mark subscription canceled
      break;
    default:
      console.log("Unhandled event type:", event.type);
  }

  res.sendStatus(200);
};

module.exports = {
  createSubscription,
  handleWebhook,
};
