require('dotenv').config();

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const HttpStatus = require('http-status-codes');

const { generateUserToken } = require('../../app/helpers/jtw');

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const refreshJwtToken = (req, res, next) => {
  try {
    const token = req.cookies['Authorization'];

    if (!token) {
      throw createError(HttpStatus.UNAUTHORIZED);
    }

    const payload = jwt.verify(token, JWT_SECRET);

    const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
    if (payload.exp - nowUnixSeconds > 30) {
      throw createError(HttpStatus.BAD_REQUEST);
    }

    const newToken = generateUserToken(payload.username, payload.id);

    res
      .cookie('Authorization', newToken, {
        maxAge: JWT_EXPIRATION,
      })
      .send();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError(HttpStatus.UNAUTHORIZED));
    }
    next(error);
  }
};

module.exports = { refreshJwtToken };
