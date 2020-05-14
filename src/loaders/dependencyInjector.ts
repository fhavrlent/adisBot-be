import { Container } from 'typedi';
import nodemailer from 'nodemailer';

import LoggerInstance from './logger';
import agendaFactory from './agenda';
import config from '../config';

export default ({
  mongoConnection,
  models,
}: {
  mongoConnection;
  models: { name: string; model: any }[];
}) => {
  try {
    models.forEach((model) => {
      Container.set(model.name, model.model);
    });

    const agendaInstance = agendaFactory({ mongoConnection });

    Container.set('agendaInstance', agendaInstance);
    Container.set('logger', LoggerInstance);
    Container.set(
      'emailClient',
      nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.mailLogin,
          pass: config.mailPassword,
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
