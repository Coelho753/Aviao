require('./config/env');
const app = require('./app');
const env = require('./config/env');
const { ensureSchema } = require('./config/db');
const { scheduleFlightSync, runSync } = require('./jobs/flightSyncJob');

const start = async () => {
  app.listen(env.port, () => {
    console.log(`[server] API disponível em http://localhost:${env.port}`);
  });

  try {
    await ensureSchema();
    await runSync();
    scheduleFlightSync();
  } catch (error) {
    console.error('[server] Falha ao preparar banco de dados', error);
  }
};

start().catch((error) => {
  console.error('[server] Falha ao iniciar aplicação', error);
  process.exit(1);
});
