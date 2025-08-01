import express from 'express';
import db from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = 'clave_secreta_super_segura';

// Middleware para verificar token y usuario activo
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido' });
  }
}

// Obtener lista de usuarios
router.get('/', authMiddleware, (req, res) => {
  db.all('SELECT id, name, email, status, lastLogin FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
    console.log('usuarios:', rows);
    res.json(rows);
  });
});

// Bloquear usuario
router.post('/block', authMiddleware, (req, res) => {
  const { ids } = req.body;
  db.run(`UPDATE users SET status='blocked' WHERE id IN (${ids.join(',')})`);
  res.json({ message: 'Usuarios bloqueados' });
});

// Desbloquear usuario
router.post('/unblock', authMiddleware, (req, res) => {
  const { ids } = req.body;
  db.run(`UPDATE users SET status='active' WHERE id IN (${ids.join(',')})`);
  res.json({ message: 'Usuarios desbloqueados' });
});

// Eliminar usuario
router.post('/delete', authMiddleware, (req, res) => {
  const { ids } = req.body;
  db.run(`DELETE FROM users WHERE id IN (${ids.join(',')})`);
  res.json({ message: 'Usuarios eliminados' });
});

export default router;
