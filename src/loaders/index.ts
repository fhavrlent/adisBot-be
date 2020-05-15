import expressLoader from './express';
import mongooseLoader from './mongoose';
import dependencyInjector from './dependencyInjector';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();

  const { agenda } = await dependencyInjector({
    mongoConnection,
  });

  agenda.start();

  await expressLoader({ app: expressApp });
};
