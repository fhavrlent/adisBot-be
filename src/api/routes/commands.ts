import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import mongoose from 'mongoose';

import { celebrate, Joi } from 'celebrate';
import { Command } from '../../models/command';
import verifyToken from '../../middlewares/verifyToken';

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

  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const commandModel = Container.get('commandModel') as mongoose.Model<
      Command & mongoose.Document
    >;
    const allCommands = await commandModel.find({});
    res.send(allCommands);
  });

  router.post(
    '/commands',
    verifyToken,
    async (req: Request, res: Response, next: NextFunction) => {},
  );
  router.delete(
    '/commands/:commandId',
    verifyToken,
    async (req: Request, res: Response, next: NextFunction) => {},
  );
};
