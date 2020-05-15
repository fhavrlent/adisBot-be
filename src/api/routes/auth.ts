import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import { celebrate, Joi } from 'celebrate';
import HttpStatus from 'http-status-codes';

import AuthService from '../../services/auth';

const router = Router();

export default (app: Router) => {
  app.use('/auth', router);

  router.post(
    '/login',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const authServiceInstance = Container.get(AuthService);
        const { user, token } = await authServiceInstance.SignIn(
          email,
          password,
        );
        return res
          .cookie('Authorization', token, {
            maxAge: 3600000,
            httpOnly: true,
            secure: true,
            sameSite: true,
          })
          .json(user)
          .status(200);
      } catch (error) {
        next(error);
      }
    },
  );

  router.put(
    '/reset-password',
    celebrate({
      body: Joi.object({
        password: Joi.string().required(),
      }),
      query: Joi.object({
        _id: Joi.string().required(),
        token: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { password } = req.body;
        const { _id, token } = req.query;
        const authServiceInstance = Container.get(AuthService);
        await authServiceInstance.ResetPassword({ token, _id, password });

        return res.status(200);
      } catch (error) {
        next(error);
      }
    },
  );

  router.post(
    '/reset-password',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.send({
          status: HttpStatus.OK,
          message: 'If email ex ist in database, email was sent',
        });
        const { email } = req.body;
        const authService = Container.get(AuthService);
        await authService.SetPasswordResetToken(email);
      } catch (error) {}
    },
  );
  //   router.post('/refresh', refreshJwtToken);
};
