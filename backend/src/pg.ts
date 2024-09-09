import { Pool } from 'pg';

const config = {
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'password',
  database: process.env.DB_NAME ?? 'database',
};

const pool = new Pool(config);

export default pool;
export const shutdown = (): Promise<void> => {
  return pool.end().then(() => {
    console.log('Pool connection has ended');
  });
};
