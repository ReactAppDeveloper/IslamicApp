const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Subscription = require("../models/Subscription");

// Create subscription and save in MongoDB
const createSubscription = async (req, res) => {
  try {
    const { email, priceId } = req.body;

    // 1️⃣ Create Stripe customer
    const customer = await stripe.customers.create({ email });

    // 2️⃣ Create ephemeral key for PaymentSheet
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2022-11-15" } // Stripe API version
    );

    // 3️⃣ Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    // 4️⃣ Save subscription in MongoDB
    const newSub = new Subscription({
      email,
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      priceId,
      status: subscription.status, // usually "incomplete"
    });
    await newSub.save();

    // 5️⃣ Return subscription + ephemeral key + client secret
    res.json({
      subscriptionId: subscription.id,
      customerId: customer.id,
      ephemeralKey: ephemeralKey.secret,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Stripe webhook to handle subscription updates
const handleWebhook = (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook error:", err.message);
    return res.sendStatus(400);
  }

  switch (event.type) {
    case "invoice.paid": {
      const invoice = event.data.object;
      Subscription.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        { status: "active" }
      ).then(() => console.log("Subscription marked active"));
      break;
    }
    case "customer.subscription.deleted": {
      const subscriptionObj = event.data.object;
      Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscriptionObj.id },
        { status: "canceled" }
      ).then(() => console.log("Subscription canceled"));
      break;
    }
    default:
      console.log("Unhandled event type:", event.type);
  }

  res.sendStatus(200);
};

module.exports = {
  createSubscription,
  handleWebhook,
};
