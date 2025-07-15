const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../utils/mailer'); // <<< 1. IMPORT THE NEW EMAIL UTILITY

const router = express.Router();

// In-memory store for password reset tokens
const passwordResetTokens = new Map(); 

// Instantiate Google OAuth Client
const oAuth2Client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

// The old transporter setup is no longer needed here as it's now in mailer.js

// --- Google Sign-In Route ---
router.post('/google-login', 
  [ body('idToken').notEmpty().withMessage('Google ID Token is required.') ],
  async (req, res, next) => {
    // ... (logic for this route remains the same)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { idToken } = req.body;
        const ticket = await oAuth2Client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, email_verified } = payload;
        if (!email_verified) {
            return res.status(400).json({ error: 'Google account email is not verified.' });
        }
        let user = await User.findOne({ email });
        if (user) {
            if (!user.isActive) {
                user.isActive = true;
                await user.save();
            }
        } else {
            const randomPassword = crypto.randomBytes(32).toString('hex');
            user = new User({
                email,
                password: randomPassword,
                isActive: true
            });
            await user.save();
        }
        const appJwtToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.status(200).json({
            token: appJwtToken,
            userId: user._id,
            email: user.email
        });
    } catch (error) {
        console.error("Google login error:", error);
        next(error);
    }
});

// --- Email/Password Registration Route ---
router.post('/register', [
  body('email').isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
], async (req, res, next) => {
  // ... (logic for creating user remains the same)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isActive) {
        return res.status(400).json({ 
            errors: [{ msg: 'This email is already registered but not activated. Please check your email for the activation link or request a new one.' }] 
        });
      }
      return res.status(400).json({ errors: [{ msg: 'User with this email already exists and is active.' }] });
    }
    const activationToken = crypto.randomBytes(32).toString('hex');
    const activationTokenExpires = Date.now() + 24 * 3600000;
    const newUser = new User({
      email,
      password,
      activationToken,
      activationTokenExpires,
      isActive: false
    });
    await newUser.save();
    const activationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/activate-account?token=${activationToken}`;
    
    // <<< 2. USE THE NEW sendEmail UTILITY FOR ACTIVATION EMAIL
    await sendEmail({
      to: email,
      subject: 'Activate Your Account - Maternity Matters',
      html: `<p>Welcome to Maternity Matters!</p><p>Please click the following link to activate your account within 24 hours:</p><p><a href="${activationUrl}" target="_blank" rel="noopener noreferrer">${activationUrl}</a></p><p>If you did not register, please ignore this email.</p>`
    });

    res.status(201).json({ message: 'Registration successful! Please check your email to activate your account.' });

  } catch (err) {
    // ... (error handling remains the same)
    if (err.name === 'MongoServerError' && err.code === 11000) {
        return res.status(500).json({ error: 'Could not generate a unique activation token. Please try registering again.' });
    }
    console.error('Registration Error:', err);
    next(err);
  }
});

// POST /api/auth/activate-account
router.post('/activate-account', [
    // ... (no changes needed in this route)
], async (req, res, next) => {
    // ...
});

// POST /api/auth/login
router.post('/login', [
    // ... (no changes needed in this route)
], async (req, res, next) => {
    // ...
});

// --- Password Reset Route ---
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
        if (!user || !user.isActive) {
            // To prevent email enumeration attacks, send a generic success message regardless.
            return res.status(200).json({ message: 'If an account with that email exists and is active, a reset link has been sent.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + 3600000;
        passwordResetTokens.set(token, { userId: user._id.toString(), expires });

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

        // <<< 3. USE THE NEW sendEmail UTILITY FOR PASSWORD RESET
        await sendEmail({
            to: email,
            subject: 'Password Reset Request - Maternity Matters',
            html: `<p>You requested a password reset. Click this link to reset your password within one hour:</p><p><a href="${resetUrl}" target="_blank" rel="noopener noreferrer">${resetUrl}</a></p><p>If you did not request this, please ignore this email.</p>`
        });

        res.json({ message: 'A password reset link has been sent to your email address.' });
    } catch (err) {
        console.error('Error in /request-reset:', err);
        // Don't leak detailed errors to the user here. Just send a generic message.
        // The error is logged on the server for you to see.
        res.status(200).json({ message: 'If an account with that email exists and is active, a reset link has been sent.' });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', [
    // ... (no changes needed in this route)
], async (req, res, next) => {
    // ...
});

module.exports = router;