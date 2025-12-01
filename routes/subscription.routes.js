const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create subscription
router.post("/create", async (req, res) => {
  try {
    const { email, priceId } = req.body;

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    res.json(subscription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stripe webhook to handle subscription events
router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
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
      // Update DB: subscription active
      break;
    case "customer.subscription.deleted":
      console.log("Subscription canceled:", event.data.object);
      // Update DB: subscription canceled
      break;
    default:
      console.log("Unhandled event:", event.type);
  }

  res.sendStatus(200);
});

module.exports = router;
