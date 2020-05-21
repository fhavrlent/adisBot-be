import { Service } from 'typedi';
import { kappaApi } from '../axiosConf';
import config from '../config';

@Service()
export default class CommandsService {
  /**
   * GetAllCommands
   */
  public async GetAllPublicCommands() {
    try {
      return await kappaApi.get(
        `bot/commands/${config.streamelementsChannelId}/public`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
}
