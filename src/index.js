import { createApp } from './app.js';
if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_URL) {
  throw new Error('CLIENT_URL is required in production');
}
const port = Number(process.env.PORT || 3000);
const server = createApp().listen(port, '0.0.0.0', () => console.log(`TeamBoard API listening on port ${port}`));
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  });
}
