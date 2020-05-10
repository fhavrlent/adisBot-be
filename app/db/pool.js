require('dotenv').config();

const { Pool } = require('pg');

const { DB_URL } = process.env;

const databaseConfig = { connectionString: DB_URL };
const pool = new Pool(databaseConfig);

exports.pool = pool;
