import mongoose from 'mongoose';
import Container from 'typedi';

import { Command } from '../models/command';

export const getCommand = async (command) => {
  const commandModel = Container.get('commandModel') as mongoose.Model<
    Command & mongoose.Document
  >;

  try {
    const commandValue =
      (await commandModel.findOne({ command })) ||
      (await commandModel.findOne({ aliases: command }));
    if (!commandValue) {
      return;
    }

    return commandValue.response;
  } catch (error) {
    console.log(error);
  }
};

export const getKeyword = async (message: string) => {
  const commandModel = Container.get('commandModel') as mongoose.Model<
    Command & mongoose.Document
  >;
  try {
    const arrayOfWords = message.split(' ');
    let responses: string[];

    responses = await Promise.all(
      arrayOfWords.map(async (res) => {
        const dbResponse = await commandModel.findOne({
          keywords: res.replace(/[^0-9a-z]/gi, ''),
        });

        return dbResponse?.response;
      }),
    );

    responses = responses.filter((e) => e !== undefined);

    return responses[0] || null;
  } catch (error) {
    console.log(error);
  }
};
