import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
const SECRET_KEY = 'clave_secreta_super_segura';
const RESET_SECRET = 'clave_reset_super_segura';

// Registro
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPass = await bcrypt.hash(password, 10);

  db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPass],
    function (err) {
      if (err) return res.status(400).json({ error: 'El correo ya existe' });
      res.json({ message: 'Usuario registrado con éxito' });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Usuario no encontrado' });

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Usuario bloqueado' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: 'Contraseña incorrecta' });

    db.run('UPDATE users SET lastLogin = ? WHERE id = ?', [new Date().toISOString(), user.id]);

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '2h' });

    res.json({ message: 'Login exitoso', token });
  });
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Email no encontrado' });

    // Generar token válido por 15 minutos
    const resetToken = jwt.sign({ id: user.id }, RESET_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    res.json({ message: 'Link de recuperación generado', resetLink });
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
      if (err) return res.status(500).json({ error: 'Error al actualizar contraseña' });
      res.json({ message: 'Contraseña actualizada con éxito' });
    });
  } catch (err) {
    return res.status(400).json({ error: 'Token inválido o expirado' });
  }
});

export default router;
