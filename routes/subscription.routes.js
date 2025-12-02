const express = require("express");
const router = express.Router();
const {
  createEphemeralKey,
  createSubscription,
  handleWebhook,
} = require("../controllers/subscription.controller");

// Ephemeral Key
router.post("/ephemeral-key", createEphemeralKey);

// Create subscription
router.post("/create", createSubscription);

// Stripe Webhook
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

module.exports = router;
