const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },

  stripeCustomerId: { type: String, required: true },
  stripeSubscriptionId: { type: String, required: true },
  paymentMethodId: { type: String },

  priceId: { type: String, required: true },
  planType: { type: String, enum: ["monthly", "yearly"], required: true },

  status: { type: String, default: "active" },

  currentPeriodEnd: Number,
  cancelAtPeriodEnd: { type: Boolean, default: false },

  isExpired: { type: Boolean, default: false },
  trialEnd: Number
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);