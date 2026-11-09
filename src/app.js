import express from 'express';
import cors from 'cors';

export function createApp({ clientUrl = process.env.CLIENT_URL || 'http://localhost:5173' } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin(origin, callback) {
    if (!origin || origin === clientUrl) return callback(null, true);
    const error = new Error('Origin is not allowed');
    error.status = 403;
    error.code = 'CORS_FORBIDDEN';
    callback(error);
  }}));
  app.use(express.json({ limit: '32kb' }));
  app.get('/', (_req, res) => res.json({ message: 'Hello World from TeamBoard API' }));
  // Liveness only: DB readiness is checked separately with npm run db:check.
  app.get('/api/v1/health', (_req, res) => res.json({ status: 'ok', service: 'teamboard-api', database: 'not-checked' }));
  app.use((_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } }));
  app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    const code = err.code || (status === 400 ? 'INVALID_JSON' : status === 413 ? 'PAYLOAD_TOO_LARGE' : 'INTERNAL_ERROR');
    res.status(status).json({ error: { code, message: status >= 500 ? 'Internal server error' : err.message } });
  });
  return app;
}
