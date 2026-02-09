require('./config/env');
const app = require('./app');
const env = require('./config/env');
const { ensureSchema } = require('./config/db');
const { scheduleFlightSync, runSync } = require('./jobs/flightSyncJob');

const start = async () => {
  await ensureSchema();
  await runSync();
  scheduleFlightSync();

  app.listen(env.port, () => {
    console.log(`[server] API disponível em http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error('[server] Falha ao iniciar aplicação', error);
  process.exit(1);
});
