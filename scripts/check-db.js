import { createDatabase } from '../src/config/db.js';
let db;
try {
  db = createDatabase();
  await db.authenticate();
  console.log('PASS: MySQL connection established');
} catch (err) {
  console.error(`FAIL: MySQL connection check (${err.name}). Check DB_* settings, credentials and network access.`);
  process.exitCode = 1;
} finally { if (db) await db.close(); }
