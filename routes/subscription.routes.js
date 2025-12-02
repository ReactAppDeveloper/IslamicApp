const express = require("express");
const router = express.Router();
const {
  createSetupIntent,
  createSubscription,
  handleWebhook,
} = require("../controllers/subscription.controller");

// ✅ Setup Intent
router.route("/setup-intent").post(createSetupIntent);

// ✅ Create Subscription
router.route("/create").post(createSubscription);

// ✅ Stripe Webhook (raw body required)
router.route("/webhook").post(express.raw({ type: "application/json" }), handleWebhook);

module.exports = router;