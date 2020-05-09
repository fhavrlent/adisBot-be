const Sentry = require('@sentry/node');

const { pool } = require('./pool');

module.exports = {
  query(quertText, params) {
    return new Promise((resolve, reject) => {
      pool
        .query(quertText, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          Sentry.captureException(err);
          reject(err);
        });
    });
  },
};
