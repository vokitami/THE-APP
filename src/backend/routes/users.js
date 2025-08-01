import express from 'express';
import db from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = 'super_secure_secret_key';

// Middleware to verify token and active user
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token required' });

  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Get users list
router.get('/', authMiddleware, (req, res) => {
  db.all('SELECT id, name, email, status, lastLogin FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error fetching users' });
    console.log('users:', rows);
    res.json(rows);
  });
});

// Block users
router.post('/block', authMiddleware, (req, res) => {
  const { ids } = req.body;
  db.run(`UPDATE users SET status='blocked' WHERE id IN (${ids.join(',')})`);
  res.json({ message: 'Users blocked' });
});

// Unblock users
router.post('/unblock', authMiddleware, (req, res) => {
  const { ids } = req.body;
  db.run(`UPDATE users SET status='active' WHERE id IN (${ids.join(',')})`);
  res.json({ message: 'Users unblocked' });
});

// Delete users
router.post('/delete', authMiddleware, (req, res) => {
  const { ids } = req.body;
  db.run(`DELETE FROM users WHERE id IN (${ids.join(',')})`);
  res.json({ message: 'Users deleted' });
});

export default router;
