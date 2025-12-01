const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// AUTH
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// PASSWORD RESET (EMAIL LINK FLOW)
router.post('/forgot', authController.forgotPassword);
router.post('/reset/:token', authController.resetPassword);

// OTP FLOW FOR EMAIL VERIFICATION
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);

// OTP-Based Password Reset
router.post('/reset-password-otp', authController.resetPasswordWithOtp);

module.exports = router;
