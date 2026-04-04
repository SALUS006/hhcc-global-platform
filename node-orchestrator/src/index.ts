import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import profileController from './controllers/profile.controller';
import schedulingController from './controllers/scheduling.controller';
import paymentController from './controllers/payment.controller';
import placeholderController from './controllers/placeholder.controller';
import authController from './controllers/auth.controller';
import { authenticateToken } from './middleware/auth.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Global health endpoint ──
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'UP', service: 'node-orchestrator' });
});

app.use('/api/v1/auth', authController);

app.use('/api/v1/profiles', authenticateToken);
app.use('/api/v1/family-members', authenticateToken);
app.use('/api/v1/pets', authenticateToken);
app.use('/api/v1/bookings', authenticateToken);
app.use('/api/v1/payments', authenticateToken);

app.use('/api/v1', profileController);
app.use('/api/v1', schedulingController);
app.use('/api/v1', paymentController);
app.use('/api/v1', placeholderController);

// ── Global error handler ──
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: err.message, status: 500 });
});

// ── Start server ──
app.listen(PORT, () => {
  console.log(`HHCC Orchestrator running on port ${PORT}`);
});

export default app;
