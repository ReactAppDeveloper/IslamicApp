const express = require("express");
const router = express.Router();
const {
  createSubscription,
  handleWebhook,
} = require("../controllers/subscription.controller");

// Route to create a subscription
router.route("/create").post(createSubscription);

// Route to handle Stripe webhook
router.route("/webhook").post(handleWebhook);

module.exports = router;