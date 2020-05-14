import { Container } from 'typedi';
import ChannelService from '../services/channel';

export default class AddPointsToAllViewers {
  public async handler(job, done): Promise<void> {
    const channelService = Container.get(ChannelService);
    const agendaService = Container.get('agendaInstance') as any;

    try {
      const isOnline = await channelService.isOnline();
      if (!isOnline) done('Channel is offline');
      const allChatters = await channelService.getChatters();

      await Promise.all(
        allChatters.map(async (name) => {
          await agendaService.schedule('now', 'add points to chatter', {
            name,
            points: 5,
          });
        }),
      );
      done();
    } catch (e) {
      done(e);
    }
  }
}
