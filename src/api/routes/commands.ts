import { Router, Request, Response } from 'express';

import verifyToken from '../../../app/middlewares/verifyToken';
import { celebrate, Joi } from 'celebrate';
import config from '../../config';
import cookieParser from 'cookie-parser';

const router = Router();

export default (app: Router) => {
  app.use('/commands', router);

  router.post(
    '/new',
    celebrate({
      body: Joi.object({
        command: Joi.string().required(),
        response: Joi.string().required(),
      }),
    }),
    verifyToken,
  );

  /*   router.get('/commands', getAllCommands);
  router.post('/commands', verifyToken, createCommand);
  router.delete('/commands/:commandId', verifyToken, deleteCommand); */
};
