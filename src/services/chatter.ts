import Container, { Service, Inject } from 'typedi';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { Model, Document } from 'mongoose';
import isEmpty from 'lodash/isEmpty';
import createError from 'http-errors';
import HttpStatus from 'http-status-codes';
import axios from 'axios';
import union from 'lodash/union';

import config from '../config';
import MailService from './email';
import { krakenApi } from '../axiosConf';
import Agenda from 'agenda';

type ViewerModel = Model<ViewerModel & Document>;

@Service()
export default class ChattersService {
  @Inject('viewerModel') private viewerModel: ViewerModel;
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
}
