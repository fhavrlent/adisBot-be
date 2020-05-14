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
import MailService from './mail';
import viewer, { Viewer } from '../models/viewer';
import { krakenApi } from '../axiosConf';

type ViewerModel = Model<Viewer & Document>;

@Service()
export default class ChattersService {
  constructor(
    @Inject('userModel') private viewerModel: ViewerModel,
    @Inject('logger') private logger,
  ) {}

  public async AddPointsToChatter(name: string, pointsToAdd?: number) {
    const viewerRecord = await (await viewer.findOne({ name }))?.toObject();

    const updatedRecord = {
      name: viewerRecord?.name || name,
      points: (viewerRecord?.points || 0) + pointsToAdd,
    };
    return await viewer.findOneAndUpdate(
      { name },
      { points: updatedRecord.points },
      async (err, res) => {
        if (err) throw err;
        if (!res) {
          await viewer.create(updatedRecord);
        }
      },
    );
  }
}
