const { pool } = require('../config/db');

const saveFlights = async (flights) => {
  if (!flights.length) {
    return 0;
  }

  const values = [];
  const placeholders = flights
    .map((flight, index) => {
      const baseIndex = index * 8;
      values.push(
        flight.airline,
        flight.price,
        flight.origin,
        flight.destination,
        flight.date,
        flight.departureTime,
        flight.arrivalTime,
        flight.duration
      );
      return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${baseIndex + 8})`;
    })
    .join(', ');

  const query = `
    INSERT INTO flights (
      airline, price, origin, destination, flight_date, departure_time, arrival_time, duration
    ) VALUES ${placeholders}
    ON CONFLICT DO NOTHING;
  `;

  const result = await pool.query(query, values);
  return result.rowCount;
};

const searchFlights = async ({ origin, destination, date, maxPrice }) => {
  const filters = [];
  const values = [];

  if (origin) {
    values.push(origin);
    filters.push(`origin = $${values.length}`);
  }
  if (destination) {
    values.push(destination);
    filters.push(`destination = $${values.length}`);
  }
  if (date) {
    values.push(date);
    filters.push(`flight_date = $${values.length}`);
  }
  if (maxPrice) {
    values.push(maxPrice);
    filters.push(`price <= $${values.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const query = `
    SELECT airline,
      price,
      origin,
      destination,
      TO_CHAR(flight_date, 'YYYY-MM-DD') AS date,
      TO_CHAR(departure_time, 'HH24:MI') AS departure_time,
      TO_CHAR(arrival_time, 'HH24:MI') AS arrival_time,
      duration
    FROM flights
    ${whereClause}
    ORDER BY price ASC;
  `;

  const { rows } = await pool.query(query, values);
  return rows;
};

module.exports = {
  saveFlights,
  searchFlights
};
