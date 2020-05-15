require('dotenv').config();

const HttpStatus = require('http-status-codes');
const createError = require('http-errors');
const nodemailer = require('nodemailer');
const HttpStatusCodes = require('http-status-codes');

const dbQuery = require('../db/dbQuery');
const { isEmpty } = require('../../app/helpers/validation');
const {
  generateUserToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} = require('../../app/helpers/jtw');

const { JWT_EXPIRATION, BASE_FE_URL } = process.env;

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
        maxAge: JWT_EXPIRATION,
        httpOnly: true,
        secure: true,
        sameSite: true,
      })
      .send(dbResponse);
  } catch (err) {
    next(err);
  }
};

const requestUserResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (isEmpty(email)) {
      throw createError(HttpStatus.BAD_REQUEST, 'Email is required.');
    }
    res.send({ message: 'If user exist, reset email was sent.' });
    const createUserQuery = `
      SELECT *
      FROM users
      WHERE email = $1
      `;

    const values = [email];

    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];

    if (!dbResponse) {
      next();
    }
    const token = generatePasswordResetToken(dbResponse);

    const url = `${BASE_FE_URL}/user/password-reset/${dbResponse.id}/${token}`;

    const emailTemplate = resetPasswordTemplate(dbResponse, url);
    await transporter.sendMail(emailTemplate);
  } catch (error) {
    next(error);
  }
};

const resetUserPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { userId, token } = req.params;

    const createUserQuery = `
    SELECT *
    FROM users
    WHERE id = $1
    `;

    const values = [userId];

    const { rows } = await dbQuery.query(createUserQuery, values);
    const dbResponse = rows[0];

    if (!dbResponse) {
      throw createError(HttpStatus.UNAUTHORIZED, 'Invalid token or user id');
    }

    const payload = verifyPasswordResetToken({
      token,
      password: dbResponse.password,
    });

    if (!payload) {
      throw createError(HttpStatus.UNAUTHORIZED, 'Invalid token or user id');
    }

    const updatePasswordQuery = `
    UPDATE users
    SET password = crypt($1, gen_salt('bf'))
    WHERE id = $2
    `;

    await dbQuery.query(updatePasswordQuery, [password, payload.userId]);
    res.send({
      status: HttpStatusCodes.OK,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser, requestUserResetPassword, resetUserPassword };

const resetPasswordTemplate = (user, url) => {
  const from = '';
  const to = user.email;
  const subject = '🚀 Adisbot Password Reset 🚀';
  const html = `
  <p>Hey ${user.username || user.email},</p>
  <p>You can use the following link to reset your password:</p>
  <a href=${url}>${url}</a>
  <p>If you don’t use this link within 1 hour, it will expire.</p>
  `;

  return { from, to, subject, html };
};
