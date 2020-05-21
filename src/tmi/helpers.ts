import Container from 'typedi';

import ChattersService from '../services/chatter';
import SingleUserService from '../services/singleUser';

const VARIABLES = {
  random: {
    pick: ({ args }) => args[Math.floor(Math.random() * args.length)],
    range: ({ args: [min, max] }) =>
      Math.floor(
        Math.random() * (parseInt(max) - parseInt(min) + 1) + parseInt(min),
      ),
  },
  user: {
    name: ({ tags }) => tags['display-name'],
    points: async ({ tags }) =>
      await Container.get(ChattersService).GetPointsOfChatter(tags.username),
    vipPoints: async ({ tags }) =>
      await Container.get(ChattersService).GetVIPPoints(tags.username),
    rank: async ({ tags }) =>
      await Container.get(SingleUserService).GetUserRank(tags.username),
  },
};

const getCommandFromList = (command) => {
  const commandArr = command.split('.');
  let finalVariable = { ...VARIABLES };
  commandArr.map((cmd) => (finalVariable = finalVariable[cmd]));

  return finalVariable;
};

export const isCommand = (command) => command && command.startsWith('!');

export const parseMessage = (message) => message.toLowerCase();

export const parseCommandResponse = async (response, tags) => {
  if (!response.includes('${')) return response;
  const variableArr = response
    .match(/(\${.[^}]*})/g)
    .map((element) => element.split('}').join('').split('${').join(''));
  let result = response;
  const arrWithResults = await Promise.all(
    variableArr.map(async (cmd) => {
      const [command, ...params] = cmd.split('(');
      const finalCmd = getCommandFromList(command) as any;
      if (!finalCmd) return;

      return await finalCmd({
        args: [...params.join().replace(')', '').split(' ')],
        tags,
      });
    }),
  );
  await Promise.all(
    arrWithResults.map(async (res) => {
      return await (result = result.replace(/(\${.[^}]*})/, res));
    }),
  );

  return result;
};
