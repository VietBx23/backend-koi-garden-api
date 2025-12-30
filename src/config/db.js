import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432,
  // Connection pool settings
  max: isProduction ? 20 : 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
  acquireTimeoutMillis: 60000, // Return an error after 60 seconds if a client cannot be acquired
  // SSL configuration
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') ? {
    rejectUnauthorized: false
  } : false,
};

console.log('🔧 Database configuration:', {
  host: dbConfig.host,
  database: dbConfig.database,
  user: dbConfig.user,
  port: dbConfig.port,
  ssl: !!dbConfig.ssl,
  environment: process.env.NODE_ENV || 'development'
});

const pool = new Pool(dbConfig);

pool.on("connect", (client) => {
  console.log("✅ New client connected to PostgreSQL database");
});

pool.on("error", (err, client) => {
  console.error("❌ Unexpected error on idle client", err);
  // Don't exit the process, just log the error
});

pool.on("acquire", (client) => {
  console.log("🔄 Client acquired from pool");
});

pool.on("release", (client) => {
  console.log("🔄 Client released back to pool");
});

// Test connection on startup
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection test successful:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    // Don't exit in production, allow the app to start and retry connections
    if (!isProduction) {
      process.exit(1);
    }
  }
};

// Test connection on startup
testConnection();

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('🔄 Gracefully shutting down database connections...');
  try {
    await pool.end();
    console.log('✅ Database connections closed');
  } catch (error) {
    console.error('❌ Error closing database connections:', error.message);
  }
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export default {
  query: (text, params) => pool.query(text, params),
  pool,
};
