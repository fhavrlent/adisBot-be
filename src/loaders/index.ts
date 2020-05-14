import expressLoader from './express';
import mongooseLoader from './mongoose';
import dependencyInjector from './dependencyInjector';
import jobsLoader from './jobs';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();

  const userModel = {
    name: 'userModel',
    // Notice the require syntax and the '.default'
    model: require('../models/user').default,
  };

  const { agenda } = await dependencyInjector({
    mongoConnection,
    models: [userModel],
  });

  await jobsLoader({ agenda });

  await expressLoader({ app: expressApp });
};
