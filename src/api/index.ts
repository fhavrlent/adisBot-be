import { Router } from 'express';
import commands from './routes/commands';
import user from './routes/user';
import auth from './routes/auth';

export default () => {
  const app = Router();
  auth(app);
  user(app);
  commands(app);

  return app;
};
