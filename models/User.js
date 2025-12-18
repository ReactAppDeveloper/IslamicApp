const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    resetToken: String,
    resetTokenExpiry: Date,
    otp: String,
    otpExpiry: Date,
    isSubscriber: { type: Boolean, default: false },
    planType: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
    stripeCustomerId: { type: String },
    subscriptionId: { type: String },
    subscriptionStatus: { type: String, default: "inactive" },
    currentPeriodEnd: {type: Date,default: null},
    lastPaymentAmount: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
