import { parseMessage, isCommand, parseCommandResponse } from './helpers';
import { getCommand } from '../controllers/commands.controller';
import Container from 'typedi';
import { Client } from 'tmi.js';

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
        if (!commandResponse) return;
        tmiClient.say(
          channel,
          await parseCommandResponse(commandResponse, tags),
        );
      }
    });

    return tmiClient;
  } catch (error) {}
};
