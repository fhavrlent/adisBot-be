import { Container } from 'typedi';
import nodemailer from 'nodemailer';
import fs from 'fs';

import LoggerInstance from './logger';
import agendaFactory from './agenda';
import config from '../config';

export default ({ mongoConnection }: { mongoConnection }) => {
  try {
    const models = fs
      .readdirSync(`${__dirname}/../models/`)
      .map((file) => file);

    models.forEach((model) => {
      const modelName = model.split('.')[0];
      Container.set(
        `${modelName}Model`,
        require(`${__dirname}/../models/${modelName}`).default,
      );
    });

    const agendaInstance = agendaFactory({ mongoConnection });
    Container.set('agendaInstance', agendaInstance);
    Container.set('logger', LoggerInstance);
    Container.set(
      'emailClient',
      nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.emailLogin,
          pass: config.emailPassword,
        },
      }),
    );

    LoggerInstance.info('✌️ Agenda injected into container');
    return { agenda: agendaInstance };
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
