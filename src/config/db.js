const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  connectionString: env.databaseUrl
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
        booking_provider VARCHAR(80) NOT NULL DEFAULT 'N/A',
        purchase_url TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await client.query(`
      ALTER TABLE flights
      ADD COLUMN IF NOT EXISTS booking_provider VARCHAR(80) NOT NULL DEFAULT 'N/A';
    `);
    await client.query(`
      ALTER TABLE flights
      ADD COLUMN IF NOT EXISTS purchase_url TEXT NOT NULL DEFAULT '';
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS flights_unique_idx
      ON flights (airline, price, origin, destination, flight_date, departure_time, arrival_time, duration, purchase_url);
    `);
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  ensureSchema
};
