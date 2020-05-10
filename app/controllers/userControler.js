require('dotenv').config();

const HttpStatus = require('http-status-codes');
const createError = require('http-errors');

const dbQuery = require('../db/dbQuery');
const { isEmpty, generateUserToken } = require('../helpers/validation');

const { JWT_EXPIRATION_SECONDS } = process.env;

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (isEmpty(username) || isEmpty(password)) {
      throw createError(
        HttpStatus.UNAUTHORIZED,
        'Username and password are required.',
      );
    }

    const createUserQuery = `
      SELECT id, username
      FROM users
      WHERE username = $1
      AND password = crypt($2, password);
      `;

    const values = [username, password];

    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];

    if (!dbResponse) {
      throw createError(
        HttpStatus.UNAUTHORIZED,
        'Invalid username or password.',
      );
    }

    const token = `Bearer ${generateUserToken(
      dbResponse.username,
      dbResponse.id,
    )}`;

    return res
      .status(HttpStatus.OK)
      .cookie('Authorization', token, {
        maxAge: JWT_EXPIRATION_SECONDS,
        httpOnly: true,
        secure: true,
        sameSite: true,
      })
      .send(dbResponse);
  } catch (err) {
    next(err);
  }
};

module.exports = { loginUser };
