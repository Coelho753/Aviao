const express = require('express');
const cors = require('cors');
const routes = require('./routes/flightRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.use(routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
