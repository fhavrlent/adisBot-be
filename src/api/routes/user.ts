import { Router, Request, Response } from 'express';
/* 
import verifyToken from '../../../app/middlewares/verifyToken';
const {
  loginUser,
  requestUserResetPassword,
  resetUserPassword,
} = require('../../app/controllers/user.controler');
const { refreshJwtToken } = require('../../app/middlewares/refreshJwtToken');
 */
const router = Router();

export default (app: Router) => {
  app.use('/user', router);

  /* router.post('/get', verifyToken, loginUser);
  router.post('/post', verifyToken, loginUser); */
};
