const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController");

router.post("/create-mobile-subscription", stripeController.createMobileSubscription);

router.post("/complete-subscription", stripeController.completeSubscription);

router.post("/retrieve-setup-intent", stripeController.retrieveSetupIntent);

router.post("/cancel-subscription", stripeController.cancelSubscription);

router.post('/check-subscription', stripeController.checkSubscriptionByEmail);

module.exports = router;
