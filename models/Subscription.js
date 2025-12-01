const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  stripeCustomerId: { type: String, required: true },
  stripeSubscriptionId: { type: String, required: true },
  priceId: { type: String, required: true },
  status: { type: String, default: "active" },
  currentPeriodEnd: Number,
  cancelAtPeriodEnd: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
