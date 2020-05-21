import { Service } from 'typedi';
import { kappaApi } from '../axiosConf';
import config from '../config';

@Service()
export default class SingleUserService {
  /**
   * GetUserRank
   */
  public async GetUserRank(username: string) {
    const { data } = await kappaApi.get(
      `points/${config.streamelementsChannelId}/${username}/rank`,
    );

    return data.rank;
  }
}
