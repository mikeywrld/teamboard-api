import { Sequelize } from 'sequelize';
export function createDatabase() {
  for (const key of ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']) {
    if (!process.env[key]) throw new Error(`${key} is required`);
  }
  return new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql', logging: false,
    dialectOptions: { connectTimeout: 10000, ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: true } } : {}) },
    pool: { max: 5, min: 0, acquire: 15000, idle: 10000 }
  });
}
