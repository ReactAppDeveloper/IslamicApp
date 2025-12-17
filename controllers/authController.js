const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 1000 * 60 * 5; // 5 min

    const user = new User({
      name,
      email,
      password: hashed,
      verified: false,
      otp,
      otpExpiry,
      isSubscriber: false,
    });

    await user.save();

    await sendEmail(email, "Verify your email", `Your OTP code is: ${otp}`);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      message: "Account created. OTP sent to your email.",
      requiresVerification: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isSubscriber: user.isSubscriber
      },
      token
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
      return res.status(403).json({ message: "Email not verified", requiresVerification: true });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isSubscriber: user.isSubscriber
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    if (
      String(user.otp) !== String(otp) ||
      Date.now() > user.otpExpiry
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      message: "Email verified successfully",
      user: {
        _id: user._id,
        email: user.email,
        isSubscriber: user.isSubscriber,
      },
      token,
    });

  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.verified) return res.status(400).json({ message: "User already verified" });

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

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 1000 * 60 * 5;

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`);

    res.status(201).json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error('Send OTP error:', err);
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

    res.status(201).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id).select('-password -otp -otpExpiry');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    console.error('/me error:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

