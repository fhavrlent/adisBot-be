import { Document, Model } from 'mongoose';
import { User } from '../../models/user';
import { Command } from '../../models/command';

declare global {
  namespace Express {
    export interface Request {
      currentUser: User & Document;
    }
  }

  namespace Models {
    export type UserModel = Model<User & Document>;
    export type CommandModel = Model<Command & Document>;
  }
}
