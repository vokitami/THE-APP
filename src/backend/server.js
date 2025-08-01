import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

const app = express();
app.use(cors());
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(3000, () => console.log('✅ Backend corriendo en http://localhost:3000'));
