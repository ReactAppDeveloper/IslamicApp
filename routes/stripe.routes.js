const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController");

// Create SetupIntent for mobile PaymentSheet
router.post("/create-mobile-subscription", stripeController.createMobileSubscription);

// Complete subscription after payment method is attached
router.post("/complete-subscription", stripeController.completeSubscription);

// Retrieve SetupIntent to get payment method ID
router.post("/retrieve-setup-intent", stripeController.retrieveSetupIntent);

// Cancel subscription
router.post("/cancel-subscription", stripeController.cancelSubscription);

module.exports = router;
