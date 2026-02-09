const { Pool } = require('pg');
const env = require('./env');

const shouldUseSsl = () => {
  if (env.databaseSsl) {
    return true;
  }

  if (!env.databaseUrl) {
    return false;
  }

  return !env.databaseUrl.includes('localhost');
};

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: shouldUseSsl() ? { rejectUnauthorized: false } : undefined
});

const ensureSchema = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS flights (
        id SERIAL PRIMARY KEY,
        airline VARCHAR(80) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        origin VARCHAR(8) NOT NULL,
        destination VARCHAR(8) NOT NULL,
        flight_date DATE NOT NULL,
        departure_time TIME NOT NULL,
        arrival_time TIME NOT NULL,
        duration VARCHAR(20) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS flights_unique_idx
      ON flights (airline, price, origin, destination, flight_date, departure_time, arrival_time, duration);
    `);
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  ensureSchema
};
