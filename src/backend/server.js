import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS global
app.use((req, res, next) => {
  const allowedOrigin = process.env.FRONTEND_URL || '*';
  console.log('Request origin:', req.headers.origin);
  console.log('Allowed origin:', allowedOrigin);

  // Solo permitir la cabecera Access-Control-Allow-Origin si el origen coincide
  if (allowedOrigin === '*') {
    res.header('Access-Control-Allow-Origin', '*');
  } else if (req.headers.origin === allowedOrigin) {
    res.header('Access-Control-Allow-Origin', allowedOrigin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Responder OPTIONS rápido (preflight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
