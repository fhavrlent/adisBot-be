require('dotenv').config();
const jwt = require('jsonwebtoken');

const { SECRET } = process.env;

const isValidEmail = (email) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};

const validatePassword = (password) => {
  if (password.length <= 5 || password === '') {
    return false;
  }
  return true;
};

const isEmpty = (input) => {
  if (input === undefined || input === '') {
    return true;
  }
  if (input.replace(/\s/g, '').length) {
    return false;
  }
  return true;
};

const empty = (input) => {
  if (input === undefined || input === '') {
    return true;
  }
};

const generateUserToken = (username, id) => {
  const token = jwt.sign(
    {
      username,
      user_id: id,
    },
    SECRET,
    { expiresIn: '3d' },
  );
  return token;
};

module.exports = {
  isValidEmail,
  validatePassword,
  isEmpty,
  empty,
  generateUserToken,
};
