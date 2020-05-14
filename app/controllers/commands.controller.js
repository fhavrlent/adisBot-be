const HttpStatus = require('http-status-codes');
const createError = require('http-errors');

const dbQuery = require('../db/dbQuery');
const { isEmpty } = require('../helpers/validation');

const createCommand = async (req, res, next) => {
  try {
    const { command, response } = req.body;

    if (isEmpty(command) || isEmpty(response)) {
      throw createError(
        HttpStatus.BAD_REQUEST,
        'Command and response are required.',
      );
    }

    if (command.startsWith('!')) {
      command.slice(1, command.length);
    }

    const createCommandQuery = `
      INSERT INTO
      command(command, response)
      VALUES($1, $2)
      returning *
      `;

    const values = [command, response];

    const { rows } = await dbQuery.query(createCommandQuery, values);
    const dbResponse = rows[0];
    return res.status(HttpStatus.CREATED).send(dbResponse);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      next(createError(HttpStatus.CONFLICT, 'Command already exist.'));
    }
    next(error);
  }
};

const deleteCommand = async (req, res, next) => {
  try {
    const { commandId } = req.params;

    if (isEmpty(commandId)) {
      throw createError(HttpStatus.BAD_REQUEST, 'No command selected');
    }

    const deleteCommandQuery = `
      DELETE FROM
      command
      WHERE id=$1
      `;
    const values = [commandId];

    await dbQuery.query(deleteCommandQuery, values);
    return res
      .status(HttpStatus.OK)
      .send({ status: HttpStatus.OK, message: 'Command deleted' });
  } catch (error) {
    next(error);
  }
};

const getAllCommands = async (_, res, next) => {
  try {
    const getAllCommandsQuery = `
      SELECT * 
      FROM command
      ORDER BY isdefault DESC;
    `;

    //TODO change in db to is_default, add function to make camelCase

    const { rows } = await dbQuery.query(getAllCommandsQuery);

    return res.status(HttpStatus.OK).send(
      rows.map((row) => ({
        ...row,
        isDefault: row.isdefault,
        isdefault: undefined,
      })),
    );
  } catch (error) {
    next(error);
  }
};

// Internal
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
    console.log(error);
  }
};

module.exports = { createCommand, deleteCommand, getAllCommands, getCommand };
