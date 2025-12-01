const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const CLIENT_URL = 'muslimapp://reset-password';

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 1000 * 60 * 5; // 5 min

    const user = new User({
      name,
      email,
      password: hashed,
      verified: false,
      otp,
      otpExpiry
    });

    await user.save();

    // Send OTP email
    await sendEmail(email, "Verify your email", `Your OTP code is: ${otp}`);

    res.status(201).json({
      success: true,
      message: "Account created. OTP sent to your email.",
      requiresVerification: true
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified) {
      return res.status(403).json({
        message: "Email not verified",
        requiresVerification: true
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1d" });

    res.json({ success: true, token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 1000 * 60 * 30; // 30 min

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetLink = `${CLIENT_URL}/${token}`;
    await sendEmail(email, 'Password Reset', `Reset your password: ${resetLink}`);

    res.json({ message: 'Reset link sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Token expired or invalid' });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 1000 * 60 * 5; // 5 minutes

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`);

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('❌ Send OTP error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

exports.resetPasswordWithOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('❌ Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.verified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });

  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};

exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.verified)
      return res.status(400).json({ message: "User already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 1000 * 60 * 5;

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendEmail(email, "Your new OTP", `Your OTP is: ${otp}`);

    res.json({ success: true, message: "New OTP sent" });

  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};
