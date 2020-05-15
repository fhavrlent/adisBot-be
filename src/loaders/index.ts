import expressLoader from './express';
import mongooseLoader from './mongoose';
import dependencyInjector from './dependencyInjector';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();

  const { agenda, tmiInstance } = await dependencyInjector({
    mongoConnection,
  });

  await agenda.start();

  await tmiInstance.connect();

  expressLoader({ app: expressApp });
};
