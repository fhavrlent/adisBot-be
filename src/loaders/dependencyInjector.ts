import { Container } from 'typedi';
import nodemailer from 'nodemailer';
import tmi from 'tmi.js';
import fs from 'fs';

import LoggerInstance from './logger';
import agendaFactory from './agenda';
import config from '../config';
import tmiLoader from '../tmi/';

export default async ({ mongoConnection }: { mongoConnection }) => {
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

    const tmiClient = tmi.client({
      options: { debug: true },
      connection: {
        reconnect: true,
        secure: true,
      },
      identity: {
        username: config.botUsername,
        password: config.botPassword,
      },
      channels: [config.channelName],
    });

    const emailClient = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.emailLogin,
        pass: config.emailPassword,
      },
    });

    Container.set('agendaInstance', agendaInstance);
    Container.set('logger', LoggerInstance);
    Container.set('emailClient', emailClient);

    const tmiInstance = await tmiLoader(tmiClient);
    Container.set('tmiInstance', tmiInstance);

    LoggerInstance.info('✌️ Agenda injected into container');
    return { agenda: agendaInstance, tmiInstance };
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
