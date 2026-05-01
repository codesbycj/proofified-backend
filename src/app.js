import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import ideasRouter from './routes/ideas.js';
import reactionsRouter from './routes/reactions.js';
import feedbackRouter from './routes/feedback.js';
import { requireSecretKey } from './middleware/secretKey.js';
import { getStats } from './controllers/ideas.js';
import { listFeedback } from './controllers/feedback.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }));
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  // Gated dashboard endpoints — must be mounted BEFORE the public routers so the
  // middleware runs first on these specific paths.
  app.get('/api/ideas/:id/stats', requireSecretKey, getStats);
  app.get('/api/ideas/:id/feedback', requireSecretKey, listFeedback);

  app.use('/api/ideas', ideasRouter);
  app.use('/api/ideas/:id/react', reactionsRouter);
  app.use('/api/ideas/:id/feedback', feedbackRouter);

  app.use((_req, res) => res.status(404).json({ error: 'not found' }));

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  });

  return app;
}
