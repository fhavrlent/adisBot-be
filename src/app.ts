import config from './config';
import express from 'express';
import Sentry from '@sentry/node';
import loaders from './loaders';

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });

  app.listen(config.port, (err) => {
    if (err) {
      Sentry.captureException(err);
      return;
    }
  });
}

startServer();
