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
    currentPeriodEnd: { type: Number },
  },
  { timestamps: true }
);

// ✅ Check if model exists to avoid OverwriteModelError
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
