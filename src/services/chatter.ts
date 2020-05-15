import { Service, Inject } from 'typedi';
import { Model, Document } from 'mongoose';
import Agenda from 'agenda';

export type ViewerModel = Model<ViewerModel & Document>;

@Service()
export default class ChattersService {
  @Inject('viewerModel') private viewerModel;
  @Inject('logger') private logger;
  @Inject('agendaInstance') private agendaInstance: Agenda;

  public async AddPointsToChatter(name: string, pointsToAdd?: number) {
    const viewerRecord = await (
      await this.viewerModel.findOne({ name })
    )?.toObject();
    const updatedRecord = {
      name: viewerRecord?.name || name,
      points: (viewerRecord?.points || 0) + pointsToAdd,
    };
    await this.viewerModel.findOneAndUpdate(
      { name },
      { points: updatedRecord.points },
      async (err, res) => {
        if (err) throw err;
        if (!res) {
          await this.viewerModel.create(updatedRecord);
        }
      },
    );
  }

  public async AddPointsToAllChatters(chatters) {
    chatters.map((name) => {
      this.agendaInstance.now('add points to chatter', { name, points: 5 });
    });
  }

  public async GetPointsOfChatter(name: string) {
    const viewer = await this.viewerModel.findOne({ name });
    return viewer.points;
  }
}
