import express from 'express';
import { projectsRouter } from './routes/projects.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '64kb' }));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'devcollab-api', phase: 1 }));
  app.use('/api/projects', projectsRouter);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found' }));
  return app;
}
