const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const CLIENT_URL = 'muslimapp://reset-password'; // Deep link

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Incoming signup request:', req.body); // 🔍 Log input

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('User already exists');
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    console.log('✅ User saved to DB:', user); // 🔍 Log saved user

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('❌ Signup error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// routes/auth.js or controller
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
