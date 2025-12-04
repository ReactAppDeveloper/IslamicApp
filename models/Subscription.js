const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stripeSubscriptionId: { type: String, required: true },
  paymentMethodId: { type: String, required: true },
  priceId: { type: String, required: true },
  planType: { type: String, required: true }, // monthly/yearly
  status: { 
    type: String, 
    enum: ["incomplete", "active", "past_due", "canceled"], 
    default: "incomplete" 
  },
  currentPeriodEnd: { type: Date },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to update the `updatedAt` timestamp automatically
subscriptionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
