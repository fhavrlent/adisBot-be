const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Sentry = require('@sentry/node');

const { errorMessage, status } = require('../helpers/status');

dotenv.config();

const verifyToken = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    errorMessage.error = 'Token not provided';
    return res.status(status.bad).send(errorMessage);
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = {
      username: decoded.email,
      user_id: decoded.user_id,
    };
    next();
  } catch (error) {
    Sentry.captureException(error);
    errorMessage.error = 'Authentication Failed';
    return res.status(status.unauthorized).send(errorMessage);
  }
};

module.exports = verifyToken;
