const { pool } = require('./pool');

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Install extensions
 */

const createExtensions = () => {
  const createExtensions = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION pgcrypto;
  `;

  pool
    .query(createExtensions)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create User Table
 */
const createUserTable = () => {
  const userCreateQuery = `
  CREATE TABLE IF NOT EXISTS users
    (id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY, 
    username TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL)
  `;

  pool
    .query(userCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create Commands Table
 */
const createCommandTable = () => {
  const commandCreateQuery = `
    CREATE TABLE IF NOT EXISTS command
      (id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY, 
      command TEXT UNIQUE NOT NULL,
      response TEXT NOT NULL)
    `;

  pool
    .query(commandCreateQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create Viwers Table
 */
const createViewersTable = () => {
  const createViewersQuery = `
    CREATE TABLE IF NOT EXISTS viewers
      (id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY, 
      username TEXT NOT NULL,
      points NUMERIC DEFAULT 0)
    `;

  pool
    .query(createViewersQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop User Table
 */
const dropUserTable = () => {
  const usersDropQuery = 'DROP TABLE IF EXISTS users';
  pool
    .query(usersDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop Bus Table
 */
const dropCommandTable = () => {
  const commandDropQuery = 'DROP TABLE IF EXISTS command';
  pool
    .query(commandDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop User Table
 */
const dropViewersTable = () => {
  const veiwersDropQuery = 'DROP TABLE IF EXISTS viewers';
  pool
    .query(veiwersDropQuery)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create All Tables
 */
const createAllTables = () => {
  createExtensions();
  createUserTable();
  createCommandTable();
  createViewersTable();
};

/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropUserTable();
  dropCommandTable();
  dropViewersTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = { dropAllTables, createAllTables };

require('make-runnable');
