import Sentry from '@sentry/node';

import config from '../config';

Sentry.init({
  dsn: config.sentry.dsn,
  environment: config.env,
});

export default Sentry;
