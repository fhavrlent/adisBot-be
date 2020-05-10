require('dotenv').config();

const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRATION_SECONDS, JWT_ALGORITHM } = process.env;

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const validatePassword = (password) =>
  !(password.length <= 5) || !(password === '');

const isEmpty = (input) =>
  input === undefined || input === '' || !input.replace(/\s/g, '').length;

const generateUserToken = (username, id) =>
  jwt.sign(
    {
      username,
      userId: id,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION_SECONDS, algorithm: JWT_ALGORITHM },
  );

module.exports = {
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken,
};
