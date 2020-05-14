require('dotenv').config();

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const validatePassword = (password) =>
  !(password.length <= 5) || !(password === '');

const isEmpty = (input) =>
  input === undefined || input === '' || !input.replace(/\s/g, '').length;

module.exports = {
  isValidEmail,
  validatePassword,
  isEmpty,
};
