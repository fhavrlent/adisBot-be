require('dotenv').config();

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const HttpStatus = require('http-status-codes');

const { JWT_SECRET } = process.env;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies['Authorization'];

    if (!token) {
      throw createError(
        HttpStatus.UNAUTHORIZED,
        'No authorization token provided.',
      );
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = {
      username: decoded.email,
      user_id: decoded.user_id,
    };
    next();
  } catch (error) {
    next(createError(HttpStatus.UNAUTHORIZED, 'Authentication Failed.'));
  }
};

module.exports = verifyToken;
