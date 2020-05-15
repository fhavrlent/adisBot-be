import { Router } from 'express';

import auth from './routes/auth';
import commands from './routes/commands';

export default () => {
  const app = Router();

  /**
   * Routes
   */
  auth(app);
  commands(app);

  return app;
};
