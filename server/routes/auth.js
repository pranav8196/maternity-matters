// server/routes/auth.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto'); // For generating tokens
const nodemailer = require('nodemailer'); // For sending emails

const router = express.Router();

// In-memory store for password reset tokens (NOT for activation tokens if they are stored in DB)
const passwordResetTokens = new Map(); 


// NODEMAILER TRANSPORTER SETUP - ONLY ONE DEFINITION
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});


// POST /api/auth/register
router.post('/register', [
  body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      // Even if user exists but is not active, prompt them to activate or re-send activation
      if (!existingUser.isActive) {
        // Optionally implement re-send activation logic here or in a separate endpoint
        return res.status(400).json({ 
            errors: [{ msg: 'This email is already registered but not activated. Please check your email for the activation link or request a new one.' }] 
        });
      }
      return res.status(400).json({ errors: [{ msg: 'User with this email already exists and is active.' }] });
    }

    const activationToken = crypto.randomBytes(32).toString('hex');
    const activationTokenExpires = Date.now() + 24 * 3600000; // Token expires in 24 hours

    const newUser = new User({
      email,
      password,
      activationToken,
      activationTokenExpires,
      isActive: false // User starts as inactive
    });
    await newUser.save();

    // Send activation email
    const activationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/activate-account?token=${activationToken}`;
    
    await transporter.sendMail({
      from: `"Maternity Justice Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Activate Your Account - Maternity Justice Portal',
      text: `Welcome to Maternity Justice Portal!\n\nPlease click on the following link, or paste it into your browser to activate your account within 24 hours:\n\n${activationUrl}\n\nIf you did not register for an account, please ignore this email.\n`,
      html: `<p>Welcome to Maternity Justice Portal!</p>
             <p>Please click on the following link, or paste it into your browser to activate your account within 24 hours:</p>
             <p><a href="${activationUrl}" target="_blank" rel="noopener noreferrer">${activationUrl}</a></p>
             <p>If you did not register for an account, please ignore this email.</p>`
    });

    res.status(201).json({ message: 'Registration successful! Please check your email to activate your account.' });

  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000 && err.keyValue.activationToken) {
        // Handle rare case of activationToken collision by suggesting user tries again
        return res.status(500).json({ error: 'Could not generate unique activation token. Please try registering again.' });
    }
    console.error('Registration Error:', err); // Log the full error for debugging
    next(err);
  }
});

// GET /api/auth/activate/:token (or POST /api/auth/activate-account with token in body)
router.post('/activate-account', [
    body('token').notEmpty().withMessage('Activation token is required.')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { token } = req.body;

    try {
        const user = await User.findOne({
            activationToken: token,
            activationTokenExpires: { $gt: Date.now() } // Check if token is not expired
        });

        if (!user) {
            return res.status(400).json({ error: 'Activation token is invalid or has expired. Please try registering again or request a new activation link.' });
        }

        user.isActive = true;
        user.activationToken = undefined; // Clear the token
        user.activationTokenExpires = undefined; // Clear expiry
        await user.save();

        res.json({ message: 'Account activated successfully! You can now log in.' });

    } catch (err) {
        next(err);
    }
});


// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.isActive) {
        // Optionally, allow resending activation email
        return res.status(403).json({ error: 'Your account is not activated. Please check your email for the activation link.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const payload = { id: user._id, email: user.email };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token: jwtToken, userId: user._id, email: user.email });
  } catch (err) {
    next(err);
  }
});


// Password Reset Routes (Keep existing ones)
// POST /api/auth/request-reset
router.post('/request-reset', [
    body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'No user found with that email address.' });
    }
    if (!user.isActive) { // Optionally, don't allow password reset for inactive accounts
        return res.status(403).json({ error: 'Account not activated. Please activate your account first.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // Token expires in 1 hour
    passwordResetTokens.set(token, { userId: user._id.toString(), expires });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"Maternity Justice Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Maternity Justice Portal',
      text: `You are receiving this email because you (or someone else) have requested a password reset for your account on Maternity Justice Portal.\n\nPlease click on the following link, or paste it into your browser to complete the process within one hour:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
      html: `<p>You are receiving this email because you (or someone else) have requested a password reset for your account on Maternity Justice Portal.</p>
             <p>Please click on the following link, or paste it into your browser to complete the process within one hour:</p>
             <p><a href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a></p>
             <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
    });

    res.json({ message: 'A password reset link has been sent to your email address. Please check your inbox (and spam folder).' });
  } catch (err) {
    console.error('Error in /request-reset:', err);
    if (err.code === 'EAUTH' || err.command === 'CONN') {
        return res.status(500).json({ error: 'Failed to send email due to server email configuration or connection issue. Please try again later or contact support.' });
    }
    next(err);
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', [
    body('token').notEmpty().withMessage('Reset token is required.'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, newPassword } = req.body;
  try {
    const tokenData = passwordResetTokens.get(token);

    if (!tokenData || tokenData.expires < Date.now()) {
      if(tokenData) passwordResetTokens.delete(token);
      return res.status(400).json({ error: 'Password reset token is invalid or has expired. Please request a new one.' });
    }

    const user = await User.findById(tokenData.userId);
    if (!user) {
      passwordResetTokens.delete(token);
      return res.status(404).json({ error: 'User associated with this token could not be found.' });
    }
    if (!user.isActive) { // Double check if user is active
        passwordResetTokens.delete(token);
        return res.status(403).json({ error: 'Account not activated. Cannot reset password.' });
    }

    user.password = newPassword;
    await user.save();
    passwordResetTokens.delete(token);

    res.json({ message: 'Your password has been successfully reset. You can now log in with your new password.' });
  } catch (err) {
    next(err);
  }
});


module.exports = router;