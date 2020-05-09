const HttpStatus = require('http-status-codes');
const Sentry = require('@sentry/node');

const dbQuery = require('../db/dbQuery');
const { isEmpty } = require('../helpers/validation');
const { errorMessage, successMessage } = require('../helpers/status');

const createCommand = async (req, res) => {
  const { command, response } = req.body;
  if (command.startsWith('!')) {
    command.slice(1, command.length);
  }
  if (isEmpty(command) || isEmpty(response)) {
    errorMessage.error = 'Command and response field cannot be empty';
    return res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
  }
  const createCommandQuery = `
      INSERT INTO
      command(command, response)
      VALUES($1, $2)
      returning *
      `;

  const values = [command, response];

  try {
    const { rows } = await dbQuery.query(createCommandQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(HttpStatus.CREATED).send(successMessage);
  } catch (error) {
    Sentry.captureException(error);
    if (error.routine === '_bt_check_unique') {
      errorMessage.error = 'Command already exist';
      return res.status(HttpStatus.CONFLICT).send(errorMessage);
    }
    errorMessage.error = 'Operation was not successful';
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessage);
  }
};

const deleteCommand = async (req, res) => {
  const { commandId } = req.params;

  if (isEmpty(commandId)) {
    errorMessage.error = 'No command selected';
    return res.status(HttpStatus.BAD_REQUEST).send(errorMessage);
  }
  const deleteCommandQuery = `DELETE FROM
      command
      WHERE id=$1`;
  const values = [commandId];

  try {
    await dbQuery.query(deleteCommandQuery, values);
    return res.status(HttpStatus.OK).send('Command deleted');
  } catch (error) {
    Sentry.captureException(error);
    errorMessage.error = 'Operation was not successful';
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessage);
  }
};

const getAllCommands = async (_, res) => {
  const getAllCommandsQuery = `
  SELECT * 
  FROM command
  ORDER BY isDefault DESC;
  `;

  try {
    const { rows } = await dbQuery.query(getAllCommandsQuery);
    const dbResponse = rows;
    if (!dbResponse[0]) {
      errorMessage.error = 'There are no commands';
      return res.status(HttpStatus.NOT_FOUND).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(HttpStatus.OK).send(successMessage);
  } catch (error) {
    Sentry.captureException(error);
    errorMessage.error = 'Operation was not successful';
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessage);
  }
};

const getCommand = async (command) => {
  const getCommandQuery = `
      SELECT response
      FROM command
      WHERE command=$1;
      `;

  const values = [command];
  try {
    const { rows } = await dbQuery.query(getCommandQuery, values);
    const dbResponse = rows[0];
    if (!dbResponse) {
      return;
    }

    return dbResponse.response;
  } catch (error) {
    Sentry.captureException(error);
  }
};

module.exports = { createCommand, deleteCommand, getAllCommands, getCommand };
