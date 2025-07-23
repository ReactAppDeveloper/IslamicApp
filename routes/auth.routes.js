const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot', authController.forgotPassword);
router.post('/reset/:token', authController.resetPassword);
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.resetPasswordWithOtp);

module.exports = router;
