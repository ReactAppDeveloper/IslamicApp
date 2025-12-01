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
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    // 3️⃣ Safely get payment intent
    let paymentIntent;
    if (
      subscription.latest_invoice &&
      subscription.latest_invoice.payment_intent
    ) {
      paymentIntent = subscription.latest_invoice.payment_intent;
    } else {
      const latestInvoiceId =
        typeof subscription.latest_invoice === "string"
          ? subscription.latest_invoice
          : subscription.latest_invoice.id;

      const latestInvoice = await stripe.invoices.retrieve(latestInvoiceId, {
        expand: ["payment_intent"],
      });
      paymentIntent = latestInvoice.payment_intent;
    }

    // 4️⃣ Save subscription to MongoDB
    await Subscription.create({
      email,
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      priceId,
      status: "incomplete",
    });

    // 5️⃣ Return only necessary info
    res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
    });
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
