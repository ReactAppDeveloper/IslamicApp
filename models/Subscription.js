// models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  priceId: String,
  status: String,
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
