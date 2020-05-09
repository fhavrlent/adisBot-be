require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Sentry = require('@sentry/node');

const commandsRoute = require('./app/routes/commandsRoute');
const userRoute = require('./app/routes/userRoute');

const { tmiClient } = require('./app/tmi/index');

const { PORT, SENTRY, NODE_ENV } = process.env;

Sentry.init({
  dsn: SENTRY,
  environment: NODE_ENV,
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1', commandsRoute);
app.use('/api/v1', userRoute);

app.listen(PORT || 8080).on('listening', () => {
  console.log(`🚀`);
});

tmiClient.connect();

module.exports = app;
