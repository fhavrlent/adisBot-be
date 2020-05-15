import { Client } from 'tmi.js';

import { parseMessage, isCommand, parseCommandResponse } from './helpers';
import { getCommand } from '../controllers/commands.controller';
import config from '../config';

const tmiClient = Client({
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
    tmiClient.say(channel, parseCommandResponse(commandResponse, tags));
  }
});

export default tmiClient;
