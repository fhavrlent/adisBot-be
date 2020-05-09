const { Pool } = require('pg');
require('dotenv').config();

const databaseConfig = { connectionString: process.env.DB_URL };
const pool = new Pool(databaseConfig);

exports.pool = pool;
