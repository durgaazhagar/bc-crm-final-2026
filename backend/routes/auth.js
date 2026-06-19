const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');
const User = require('../models/User');
const authStore = require('../config/authStore');
const db = require('../config/db');

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'bloodconnect_secret';
const jwtOptions = { expiresIn: '7d' };

const normalizeEmail = (email) => email?.toString().trim().toLowerCase();

const AUTH_FALLBACK_ENABLED = process.env.AUTH_FALLBACK === 'true';
const isFallbackEnabled = () => AUTH_FALLBACK_ENABLED;

const getUserFromStore = async (email, role) => {
  const normalizedEmail = normalizeEmail(email);
  if (db.isDBConnected()) {
    return await User.findOne({ email: normalizedEmail, role }).lean();
  }
  if (isFallbackEnabled()) {
    return await authStore.findByEmail(normalizedEmail);
  }
  return null;
};

const getUserById = async (id) => {
  if (db.isDBConnected()) {
    return await User.findById(id).lean();
  }
  if (isFallbackEnabled()) {
    return await authStore.findById(id);
  }
  return null;
};

const authStatus = () => {
  if (db.isDBConnected()) {
    return { fallback: false, db: 'connected' };
  }
  if (isFallbackEnabled()) {
    return { fallback: true };
  }
  return { error: 'Server unavailable' };
};

router.get('/fallback-status', (req, res) => {
  const status = authStatus();
  if (status.error) {
    return res.status(503).json(status);
  }
  res.json(status);
});

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword, role = 'admin' } = req.body;

  console.log('Register payload:', {
    name: name ? '[REDACTED]' : null,
    email: email ? email.toString().trim().toLowerCase() : null,
    hasPassword: Boolean(password),
    hasConfirmPassword: Boolean(confirmPassword),
    role,
  });

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const normalizedEmail = normalizeEmail(email);
  const fallbackAuth = !db.isDBConnected() && isFallbackEnabled();
  
  // Log DB connection status
  res.locals.dbConnected = db.isDBConnected();

  try {
    let createdUser;
    if (db.isDBConnected()) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      createdUser = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
      });
    } else if (fallbackAuth) {
      res.locals.authFallback = true;
      console.warn('MongoDB unavailable - using in-memory auth fallback for registration.');
      createdUser = await authStore.createUser({
        name,
        email: normalizedEmail,
        password,
        role,
      });
    } else {
      return res.status(503).json({ message: 'Server temporarily unavailable. Please try again later.' });
    }

    // Generate JWT token for new user
    const payload = {
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
      },
    };
    const token = jwt.sign(payload, jwtSecret, jwtOptions);

    return res.status(201).json({
      success: true,
      token,
      redirect: '/home',
      message: 'User registered successfully',
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (err) {
    if (err.code === 11000 || err.message?.includes('User already exists')) {
      return res.status(400).json({ message: 'User already exists' });
    }
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server temporarily unavailable. Please try again later.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and role are required.',
    });
  }

  const normalizedEmail = normalizeEmail(email);
  const fallbackAuth = !db.isDBConnected() && isFallbackEnabled();

  res.locals.dbConnected = db.isDBConnected();

  try {
    if (!db.isDBConnected() && !isFallbackEnabled()) {
      return res.status(503).json({
        success: false,
        message: 'Server temporarily unavailable. Please try again later.',
      });
    }

    let user = await getUserFromStore(normalizedEmail, role);
    if (!user && fallbackAuth) {
      res.locals.authFallback = true;
      console.warn('MongoDB unavailable - using in-memory auth fallback for login.');
      user = await authStore.findByEmail(normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, jwtSecret, jwtOptions);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server temporarily unavailable. Please try again later.',
    });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = normalizeEmail(email);

  try {
    let user = null;
    let fallbackAuth = false;
    if (db.isDBConnected()) {
      user = await User.findOne({ email: normalizedEmail });
    }

    if (!user && isFallbackEnabled()) {
      fallbackAuth = true;
      res.locals.authFallback = true;
      console.warn('MongoDB unavailable - using in-memory auth fallback for password reset request.');
      user = await authStore.findByEmail(normalizedEmail);
    }

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expires = Date.now() + 3600000;

      if (fallbackAuth) {
        await authStore.setResetToken({ email: normalizedEmail, resetPasswordToken: resetTokenHash, resetPasswordExpires: expires });
      } else {
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = expires;
        await user.save();
      }

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4177';
      const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
      const message = `You requested a password reset for BloodConnect CRM AI+X.\n\nClick the link below to reset your password:\n${resetUrl}\n\nIf you did not request this, ignore this email.`;

      if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: user.email,
          subject: 'BloodConnect Password Reset',
          text: message,
        });
      } else {
        console.log(`Password reset link for ${user.email}: ${resetUrl}`);
      }
    }

    res.json({ message: 'If an account exists for that email, a reset link has been sent.' });
  } catch (err) {
    console.error('Password reset request error:', err);
    res.status(500).json({ message: 'Server temporarily unavailable. Please try again.' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Invalid reset request' });
  }

  try {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    let user = null;
    let fallbackAuth = false;

    if (db.isDBConnected()) {
      user = await User.findOne({ resetPasswordToken: resetTokenHash, resetPasswordExpires: { $gt: Date.now() } });
    }

    if (!user && isFallbackEnabled()) {
      fallbackAuth = true;
      res.locals.authFallback = true;
      console.warn('MongoDB unavailable - using in-memory auth fallback for password reset.');
      user = await authStore.findByResetToken(resetTokenHash);
    }

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired' });
    }

    if (fallbackAuth) {
      await authStore.updatePassword(user, password);
    } else {
      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
    }

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server temporarily unavailable. Please try again.' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!db.isDBConnected() && isFallbackEnabled()) {
      res.locals.authFallback = true;
    }

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server temporarily unavailable. Please try again later' });
  }
});

module.exports = router;
