const HttpStatus = require('http-status-codes');
const Sentry = require('@sentry/node');

const dbQuery = require('../db/dbQuery');
const { isEmpty, generateUserToken } = require('../helpers/validation');
const { errorMessage, successMessage } = require('../helpers/status');

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (isEmpty(username) || isEmpty(password)) {
    errorMessage.error = 'Username and password field cannot be empty';
    return res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
  }

  const createUserQuery = `
      SELECT id, username
      FROM users
      WHERE username = $1
      AND password = crypt($2, password);
      `;

  const values = [username, password];
  try {
    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];
    if (!dbResponse) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .send('Invalid username or password');
    }
    const token = generateUserToken(dbResponse.username, dbResponse.id);
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(HttpStatus.OK).send(successMessage);
  } catch (error) {
    Sentry.captureException(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send('An error has ocurred');
  }
};

module.exports = { loginUser };
