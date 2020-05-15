import seeder from 'mongoose-seed';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import cryptoRandomString from 'crypto-random-string';

import config from '../config';

seeder.connect(config.databaseURL, async () => {
  seeder.loadModels(['./src/models/user.ts']);

  const data = await getData();

  seeder.clearModels(['User'], function () {
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });
  });
});

const getData = async () => {
  return [
    {
      model: 'User',
      documents: [
        {
          name: config.adminName,
          password: await argon2.hash(cryptoRandomString({ length: 10 }), {
            salt: randomBytes(32),
          }),
          email: config.adminEmail,
        },
      ],
    },
  ];
};
