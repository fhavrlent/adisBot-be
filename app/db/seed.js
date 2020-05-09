require('dotenv').config();

const { pool } = require('./pool');

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * SEED Users
 */
const seedUsers = () => {
  const seedUserQuery = `
    INSERT INTO users 
    VALUES ( default, $1, crypt($2, gen_salt('bf')) )
    `;

  pool
    .query(seedUserQuery, [process.env.ADMIN_USERNAME, process.env.ADMIN_PWD])
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
 * SEED Commands
 */
const seedCommands = () => {
  const seedUserQuery = `
    INSERT INTO command 
    VALUES 
    ( default, 'ping', 'pong' ),
    ( default, 'flip', '/me Hádžeš mincou a je to.... \${random.pick(hlava znak)}!'),
    ( default, 'age', '\${user.name} Tvoj vek je \${random.range(5 60)}!')
    `;

  pool
    .query(seedUserQuery)
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
 * Seed all
 */
const seed = () => {
  seedUsers();
  seedCommands();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = { seed };

require('make-runnable');
