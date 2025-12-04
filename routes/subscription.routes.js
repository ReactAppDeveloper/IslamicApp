const express = require("express");
const router = express.Router();
const {
  createSetupIntentSession,
  createSubscription,
  handleWebhook,
} = require("../controllers/subscription.controller");

// 1️⃣ Create SetupIntent + Ephemeral Key (initial card setup)
router.route("/setup-intent").post(createSetupIntentSession);

// 2️⃣ Create subscription (after confirming card)
router.route("/create").post(createSubscription);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

module.exports = router;
