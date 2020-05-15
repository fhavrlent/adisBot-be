import { Container } from 'typedi';
import ChannelService from '../services/channel';
import ChattersService from '../services/chatter';
import viewer from '../models/viewer';

module.exports = function (agenda) {
  agenda.define('add points to all chatters', async (job, done) => {
    const channelService = Container.get(ChannelService);
    const chatterService = Container.get(ChattersService);
    const { pointsToAdd } = job.attrs.data;

    try {
      const isOnline = await channelService.isOnline();
      if (!isOnline) {
        done('Channel is offline');
        return;
      }
      const allChatters = await channelService.getChatters();

      await chatterService.AddPointsToAllChatters(allChatters);

      done();
    } catch (e) {
      done(e);
    }
  });

  agenda.define('add points to chatter', async (job, done) => {
    const chatterService = Container.get(ChattersService);
    const { name, points } = job.attrs.data;

    try {
      chatterService.AddPointsToChatter(name, points);
      done();
    } catch (e) {
      done(e);
    }
  });
};
