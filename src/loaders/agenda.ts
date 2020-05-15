import Agenda from 'agenda';
import fs from 'fs';

import config from '../config';

export default ({ mongoConnection }) => {
  const agenda = new Agenda({
    mongo: mongoConnection,
    db: { collection: config.agenda.dbCollection },
    maxConcurrency: 30000,
    defaultConcurrency: 5000,
  });

  const jobTypes = fs.readdirSync(`${__dirname}/../jobs`).map((file) => file);

  jobTypes.forEach((type) => {
    const typeName = type.split('.')[0];
    require(`../jobs/${typeName}`)(agenda);
  });
  return agenda;
};
