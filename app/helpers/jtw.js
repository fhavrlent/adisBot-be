const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRATION, JWT_ALGORITHM } = process.env;

const generatePasswordResetToken = ({ password, id }) =>
  jwt.sign(
    {
      userId: id,
    },
    `${password}-${JWT_SECRET}`,
    { expiresIn: parseInt(JWT_EXPIRATION), algorithm: JWT_ALGORITHM },
  );

const verifyPasswordResetToken = ({ token, password }) =>
  jwt.verify(token, `${password}-${JWT_SECRET}`);

const generateUserToken = (username, id) =>
  jwt.sign(
    {
      username,
      userId: id,
    },
    JWT_SECRET,
    { expiresIn: parseInt(JWT_EXPIRATION), algorithm: JWT_ALGORITHM },
  );

module.exports = {
  generateUserToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
};
