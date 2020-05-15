import expressLoader from './express';
import mongooseLoader from './mongoose';
import dependencyInjector from './dependencyInjector';
import tmiClient from '../tmi';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();

  const { agenda } = await dependencyInjector({
    mongoConnection,
  });

  tmiClient.connect();

  agenda.start();

  await expressLoader({ app: expressApp });
};
