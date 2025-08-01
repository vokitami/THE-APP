import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Configuración de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // O especifica tu frontend: 'https://the-app-2am5.vercel.app'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Incluir OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
}));

// Middleware para manejar OPTIONS explícitamente (por si acaso)
app.options('*', cors());

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
