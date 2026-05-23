import express from 'express';
import authRoutes from './modules/auth/auth.routes';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'DevPulse API is running' });
});

export default app;