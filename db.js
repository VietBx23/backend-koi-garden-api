import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
});

(async () => {
  try {
    console.log('⏳ Connecting to PostgreSQL...');
    console.log('🔗 DB:', process.env.DB_HOST, process.env.DB_NAME);

    const result = await pool.query('SELECT 1');

    console.log('✅ PostgreSQL CONNECT SUCCESS');
    console.log('📦 Test result:', result.rows);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ PostgreSQL CONNECT FAILED');
    console.error('🔴 Error:', error.message);
    process.exit(1);
  }
})();
