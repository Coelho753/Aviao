const dotenv = require('dotenv');

dotenv.config();

const required = ['PORT', 'DATABASE_URL'];
required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[env] Variável ${key} não definida.`);
  }
});

module.exports = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  amadeusClientId: process.env.AMADEUS_CLIENT_ID,
  amadeusClientSecret: process.env.AMADEUS_CLIENT_SECRET,
  useMockProvider: process.env.USE_MOCK_PROVIDER === 'true',
  syncRoutes: process.env.SYNC_ROUTES,
  syncDaysAhead: Number(process.env.SYNC_DAYS_AHEAD || 1),
  defaultOrigin: process.env.DEFAULT_ORIGIN || 'GRU',
  defaultDestination: process.env.DEFAULT_DESTINATION || 'GIG'
};
