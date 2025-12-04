const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const User = require("../models/user");
const SubscriptionModel = require("../models/subscription");

// 1️⃣ Create SetupIntent + Ephemeral Key
const createSetupIntentSession = async (req, res) => {
  try {
    const { email, planType, priceId } = req.body;
    if (!email || !priceId || !planType)
      return res.status(400).json({ error: "Missing required fields" });

    // Get or create customer
    let customer;
    const existing = await stripe.customers.list({ email, limit: 1 });
    if (existing.data.length > 0) customer = existing.data[0];
    else customer = await stripe.customers.create({ email });

    // Create SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
    });

    // Create ephemeral key
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2022-11-15" }
    );

    // Save/update user with stripeCustomerId and planType
    await User.findOneAndUpdate(
      { email },
      { stripeCustomerId: customer.id, planType },
      { upsert: true, new: true }
    );

    res.json({
      customer: customer.id,
      ephemeralKey: ephemeralKey.secret,
      setupIntentClientSecret: setupIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (err) {
    console.error("SetupIntent Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 2️⃣ Create Subscription
const createSubscription = async (req, res) => {
  try {
    const { customerId, paymentMethodId, priceId, planType, email } = req.body;
    if (!paymentMethodId) return res.status(400).json({ error: "PaymentMethod ID is required" });

    // Attach payment method
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Create subscription (incomplete initially)
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
      payment_behavior: "default_incomplete",
    });

    const latestInvoice = subscription.latest_invoice;
    const paymentIntent = latestInvoice?.payment_intent;

    // Determine frontend status
    let subscriptionStatus = subscription.status;
    if (paymentIntent && paymentIntent.status === "requires_action") {
      subscriptionStatus = "requires_action"; // SCA needed
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      subscriptionStatus = "active";
    }

    res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret || null,
      status: subscriptionStatus,
    });
  } catch (err) {
    console.error("Subscription Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 3️⃣ Handle Stripe Webhook
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
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;

        // Find user
        const user = await User.findOne({ stripeCustomerId: subscription.customer });
        if (!user) break;

        // Save or update Subscription collection
        await SubscriptionModel.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            userId: user._id,
            stripeSubscriptionId: subscription.id,
            planType: subscription.items.data[0].price.nickname || "monthly",
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : null,
            priceId: subscription.items.data[0].price.id,
          },
          { upsert: true, new: true }
        );

        // Update User
        await User.findOneAndUpdate(
          { _id: user._id },
          {
            isSubscriber: subscription.status === "active",
            subscriptionId: subscription.id,
            planType: subscription.items.data[0].price.nickname || "monthly",
            currentPeriodEnd: subscription.current_period_end || null,
          }
        );

        console.log("Subscription created/updated in MongoDB via webhook");
        break;
      }

      case "invoice.payment_succeeded": {
        const subscriptionId = event.data.object.subscription;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const user = await User.findOne({ stripeCustomerId: subscription.customer });
        if (!user) break;

        await SubscriptionModel.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          { status: subscription.status }
        );

        await User.findOneAndUpdate(
          { _id: user._id },
          { isSubscriber: subscription.status === "active" }
        );

        console.log("Subscription status updated after payment_succeeded");
        break;
      }

      case "invoice.payment_failed": {
        const subscriptionId = event.data.object.subscription;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const user = await User.findOne({ stripeCustomerId: subscription.customer });
        if (!user) break;

        await SubscriptionModel.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          { status: "incomplete" }
        );

        await User.findOneAndUpdate(
          { _id: user._id },
          { isSubscriber: false }
        );

        console.log("Subscription failed, user updated in MongoDB");
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handling error:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createSetupIntentSession,
  createSubscription,
  handleWebhook,
};
