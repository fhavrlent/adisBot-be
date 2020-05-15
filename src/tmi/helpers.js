const VALID_VARIABLES = ['random.pick', 'random.range', 'user.name'];

const VARIABLES = {
  random: {
    pick: ({ args }) => {
      return args[Math.floor(Math.random() * args.length)];
    },
    range: ({ args: [min, max] }) =>
      Math.floor(
        Math.random() * (parseInt(max) - parseInt(min) + 1) + parseInt(min),
      ),
  },
  user: {
    name: ({ tags }) => tags['display-name'],
  },
};

const getCommandFromList = (command) => {
  const commandArr = command.split('.');
  let finalVariable = { ...VARIABLES };
  commandArr.map((cmd) => (finalVariable = finalVariable[cmd]));
  return finalVariable;
};

const isCommand = (command) => command && command.startsWith('!');

const parseMessage = (message) => message.toLowerCase();

const isValidVariable = (cmd) =>
  cmd && VALID_VARIABLES.includes(cmd.split('(')[0]);

const parseCommandResponse = (response, tags) => {
  if (!response.includes('${')) return response;
  const variableArr = response
    .match(/(\${.[^}]*})/g)
    .map((element) => element.split('}').join('').split('${').join(''));

  let result = response;
  variableArr
    .filter((cmd) => isValidVariable(cmd))
    .map((cmd) => {
      const [command, ...params] = cmd.split('(');
      const finalCmd = getCommandFromList(command);
      if (!finalCmd) return;
      return finalCmd({
        args: [...params.join().replace(')', '').split(' ')],
        tags,
      });
    })
    .map((res) => (result = result.replace(/(\${.[^}]*})/, res)));
  return result;
};

module.exports = {
  parseCommandResponse,
  isCommand,
  parseMessage,
};
