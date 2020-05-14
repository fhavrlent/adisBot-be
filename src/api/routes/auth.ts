import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import { celebrate, Joi } from 'celebrate';
import HttpStatus from 'http-status-codes';

import AuthService from '../../services/auth';
import MailService from '../../services/mail';

const router = Router();

export default (app: Router) => {
  app.use('/auth', router);

  router.post(
    '/signin',
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
            maxAge: 3600,
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
          message: 'If email exist in database, email was sent',
        });
        const { email } = req.body;
        const authServiceInstance = Container.get(AuthService);
        const mailServiceInstance = Container.get(MailService);
        const { token, user } = await authServiceInstance.SetPasswordResetToken(
          email,
        );
        await mailServiceInstance.SendPasswordResetMail(user, token);
      } catch (error) {}
    },
  );
  /*   router.post('/refresh', refreshJwtToken);
  router.post('/password-reset', requestUserResetPassword);
  router.put('/password-reset/:userId/:token', resetUserPassword); */
};
