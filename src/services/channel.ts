import { Service, Inject } from 'typedi';
import axios from 'axios';
import union from 'lodash/union';

import config from '../config';
import { krakenApi } from '../axiosConf';

@Service()
export default class ChannelService {
  public async getChatters() {
    const {
      data: {
        chatters: {
          broadcaster,
          vips,
          moderators,
          staff,
          admins,
          global_mods: globalMods,
          viewers,
        },
      },
    } = await axios.get(
      `https://tmi.twitch.tv/group/user/${config.channelName}/chatters`,
    );

    return union(
      broadcaster,
      vips,
      moderators,
      staff,
      admins,
      globalMods,
      viewers,
    );
  }

  public async isOnline() {
    const { data } = await krakenApi.get(`streams/${config.channelId}`);
    return data?.stream?.stream_type === 'live';
  }
}
