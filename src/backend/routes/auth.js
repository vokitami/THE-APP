import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
const SECRET_KEY = 'super_secure_secret_key';
const RESET_SECRET = 'super_secure_reset_secret';

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPass = await bcrypt.hash(password, 10);

  db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPass],
    function (err) {
      if (err) return res.status(400).json({ error: 'Email already exists' });
      res.json({ message: 'User registered successfully' });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'User not found' });

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'User is blocked' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: 'Incorrect password' });

    db.run('UPDATE users SET lastLogin = ? WHERE id = ?', [new Date().toISOString(), user.id]);

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '2h' });

    res.json({ message: 'Login successful', token });
  });
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Email not found' });

    // Generate token valid for 15 minutes
    const resetToken = jwt.sign({ id: user.id }, RESET_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    res.json({ message: 'Recovery link generated', resetLink });
  });
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, RESET_SECRET);

    const hashedPass = await bcrypt.hash(password, 10);
    db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPass, decoded.id], function (err) {
      if (err) return res.status(500).json({ error: 'Error updating password' });
      res.json({ message: 'Password updated successfully' });
    });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
});

export default router;
