import mongoose from 'mongoose';
import Container from 'typedi';

import { Command } from '../models/command';

export const getCommand = async (command) => {
  const commandModel = Container.get('commandModel') as mongoose.Model<
    Command & mongoose.Document
  >;

  try {
    const commandValue = await commandModel.findOne({ command });
    if (!commandValue) {
      return;
    }

    return commandValue.response;
  } catch (error) {}
};
