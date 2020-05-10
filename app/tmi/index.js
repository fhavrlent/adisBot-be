require('dotenv').config();

const tmi = require('tmi.js');

const { getCommand } = require('../controllers/commandsController');
const { parseCommandResponse, isCommand, parseMessage } = require('./helpers');

const { BOT_USERNAME, BOT_PASSWORD, CHANNEL } = process.env;

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: BOT_USERNAME,
    password: BOT_PASSWORD,
  },
  channels: [CHANNEL],
});

client.on('message', async (channel, tags, message, self) => {
  if (self) return;
  const parsedMessage = parseMessage(message);
  if (isCommand(parsedMessage)) {
    const values = parsedMessage.split(' ');
    const commandResponse = await getCommand(
      values[0].slice(1, values[0].length),
    );
    if (!commandResponse) return;
    client.say(channel, parseCommandResponse(commandResponse, tags));
  }
});

exports.tmiClient = client;
