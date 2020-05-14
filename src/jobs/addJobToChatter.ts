import { Container } from 'typedi';
import ChannelService from '../services/channel';
import ChattersService from '../services/chatter';

export default class AddPointsToChatter {
  public async handler(job, done): Promise<void> {
    const chatterService = Container.get(ChattersService);
    const { name, points } = job.attrs.data;
    try {
      await chatterService.AddPointsToChatter(name, points);

      done();
    } catch (e) {
      done(e);
    }
  }
}
