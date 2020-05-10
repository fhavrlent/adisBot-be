require('dotenv').config();

const createError = require('http-errors');
const HttpStatus = require('http-status-codes');
const express = require('express');
const cors = require('cors');
const Sentry = require('@sentry/node');
const cookieParser = require('cookie-parser');

const commandsRoute = require('./app/routes/commandsRoute');
const userRoute = require('./app/routes/userRoute');
const { tmiClient } = require('./app/tmi/index');

const { PORT, SENTRY_URL, NODE_ENV, COOKIE_SECRET, CORS_ORIGIN } = process.env;

Sentry.init({
  dsn: SENTRY_URL,
  environment: NODE_ENV,
});

const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser(COOKIE_SECRET));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/**
 * Routes
 */
app.use('/api/v1', commandsRoute);
app.use('/api/v1', userRoute);

/**
 * Error Handlers
 */
app.use((req, res, next) => {
  next(createError(HttpStatus.NOT_FOUND));
});

app.use(({ status = 500, message, stack }, req, res, next) => {
  Sentry.captureException({ status, message, stack });
  res.status(status).send({ status, message });
  next();
});

/**
 * App and tmiClient connect
 */
app.listen(PORT || 8080).on('listening', () => {
  console.log(`🚀`);
});

tmiClient.connect();

module.exports = app;
