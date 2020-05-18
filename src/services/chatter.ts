import { Model, Document } from 'mongoose';
import { Service, Inject } from 'typedi';
import Agenda from 'agenda';

import { kappaApi } from '../axiosConf';
import config from '../config';

@Service()
export default class ChattersService {
  constructor(
    @Inject('viewerModel') private viewerModel,
    @Inject('agendaInstance') private agendaInstance: Agenda,
  ) {}

  public async AddPointsToChatter(name: string, pointsToAdd?: number) {
    try {
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
    } catch (error) {}
  }

  public AddPointsToAllChatters(chatters, pointsToAdd) {
    chatters.map((name) => {
      this.agendaInstance.now('add points to chatter', {
        name,
        points: pointsToAdd,
      });
    });
  }

  public async GetPointsOfChatter(name: string) {
    try {
      const { data } = await kappaApi.get(
        `points/${config.streamelementsChannelId}/${name}`,
      );
      return data.points;
    } catch (error) {}
  }

  public async GetVIPPoints(name: string) {
    try {
      const viewer = await this.viewerModel.findOne({ name });
      return viewer?.points || 0;
    } catch (error) {}
  }
}
