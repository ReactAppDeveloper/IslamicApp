const express = require("express");
const router = express.Router();
const {createSubscription,handleWebhook} = require("../controllers/subscription.controller");

// Create subscription
router.post("/create", createSubscription);

// Webhook endpoint
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

module.exports = router;