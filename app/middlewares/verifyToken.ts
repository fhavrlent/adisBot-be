import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import HttpStatus from 'http-status-codes';

import config from '../../src/config';
import { User } from '../../src/models/user';

const verifyToken = async (req, res, next) => {
  try {
    console.log(res.cookies);
    const token = req.cookies['Authorization'];
    console.log(token);
    if (!token) {
      throw createError(
        HttpStatus.UNAUTHORIZED,
        'No authorization token provided',
      );
    }

    const decoded = jwt.verify(
      token.replace('Bearer ', ''),
      config.jwtSecret,
    ) as User;

    req.user = {
      username: decoded.email,
      _id: decoded._id,
    };
    next();
  } catch (error) {
    next(createError(HttpStatus.UNAUTHORIZED, 'Authentication Failed'));
  }
};

export default verifyToken;
