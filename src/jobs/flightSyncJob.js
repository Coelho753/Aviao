const cron = require('node-cron');
const env = require('../config/env');
const flightService = require('../services/flightService');

const parseRoutes = () => {
  if (!env.syncRoutes) {
    return [{ origin: env.defaultOrigin, destination: env.defaultDestination }];
  }

  return env.syncRoutes
    .split(',')
    .map((route) => route.trim())
    .filter(Boolean)
    .map((route) => {
      const [origin, destination] = route.split('-');
      return { origin, destination };
    });
};

const getTargetDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + env.syncDaysAhead);
  return date.toISOString().slice(0, 10);
};

const runSync = async () => {
  const routes = parseRoutes();
  const date = getTargetDate();

  for (const route of routes) {
    try {
      const result = await flightService.syncFlights({
        origin: route.origin,
        destination: route.destination,
        date
      });
      console.log(`[flightSyncJob] ${route.origin}-${route.destination} ${date} -> ${result.saved} registros.`);
    } catch (error) {
      console.error(`[flightSyncJob] Erro ao sincronizar ${route.origin}-${route.destination}`, error);
    }
  }
};

const scheduleFlightSync = () => {
  cron.schedule('*/30 * * * *', () => {
    runSync();
  });
};

module.exports = {
  scheduleFlightSync,
  runSync
};
