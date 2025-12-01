const express = require("express");
const router = express.Router();

const {createSetupIntent,createSubscription,handleWebhook} = require("../controllers/subscription.controller");

router.post("/setup-intent", createSetupIntent);

router.post("/create", createSubscription);

router.post("/webhook",express.raw({ type: "application/json" }),handleWebhook);

module.exports = router;
