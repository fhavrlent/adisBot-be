import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import HttpStatus from 'http-status-codes';
import cookieparser from 'cookie-parser';
import createError from 'http-errors';

import routes from '../api';
import config from '../config';
// import sentry from './sentry';

export default ({ app }: { app: express.Application }) => {
  /**
   * Health Check endpoints
   */
  app.get('status', (req, res) => res.status(HttpStatus.OK).end());
  app.head('/status', (req, res) => res.status(HttpStatus.OK).end());

  /**
   * Configuration, middleware, etc.
   */
  app.enable('trust proxy');
  app.use(bodyParser.json());
  app.use(config.api.prefix, routes());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );
  app.use(cookieparser(config.cookieSecret));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  /**
   * Error Handlers
   */
  app.use((req, res, next) => {
    next(createError(HttpStatus.NOT_FOUND));
  });

  app.use(({ status = 500, message, stack }, req, res, next) => {
    // sentry.captureException({ status, message, stack });
    res.status(status).send({ status, message });
    next();
  });
};
