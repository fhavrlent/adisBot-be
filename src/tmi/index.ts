import { Client } from 'tmi.js';

import { parseMessage, isCommand, parseCommandResponse } from './helpers';
import { getCommand, getKeyword } from '../controllers/commands.controller';

export default async (tmiClient: Client) => {
  try {
    tmiClient.on('connected', () => {
      console.log('connected');
    });

    tmiClient.on('message', async (channel, tags, message, self) => {
      if (self) return;
      const parsedMessage = parseMessage(message);
      if (isCommand(parsedMessage)) {
        const values = parsedMessage.split(' ');
        const commandResponse = await getCommand(
          values[0].slice(1, values[0].length),
        );
        if (commandResponse) {
          tmiClient.say(
            channel,
            await parseCommandResponse(commandResponse, tags),
          );
        }
      } else {
        const keywordResponse = await getKeyword(message);
        if (keywordResponse)
          tmiClient.say(
            channel,
            await parseCommandResponse(keywordResponse, tags),
          );
      }
    });

    return tmiClient;
  } catch (error) {
    console.log(error);
  }
};
