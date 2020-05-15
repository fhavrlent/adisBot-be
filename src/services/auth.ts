import Container, { Service, Inject } from 'typedi';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { Model, Document } from 'mongoose';
import isEmpty from 'lodash/isEmpty';
import createError from 'http-errors';
import HttpStatus from 'http-status-codes';

import user, { User } from '../models/user';
import config from '../config';
import MailService from './email';
import Agenda from 'agenda';

type UserModel = Model<User & Document>;

@Service()
export default class AuthService {
  @Inject('agendaInstance') private agendaInstance: Agenda;

  public async SignIn(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const userRecord = await user.findOne({ email });
    if (!userRecord) {
      throw new Error('Invalid email or password');
    }

    const validPassword = await argon2.verify(userRecord.password, password);
    if (validPassword) {
      const token = this.generateToken(userRecord);

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');

      return { user, token: `Bearer ${token}` };
    } else {
      throw new Error('Invalid email or password');
    }
  }

  public async SetPasswordResetToken(email: string) {
    try {
      const userRecord = await user.findOne({ email });
      if (!userRecord) return;

      const token = this.generatePasswordResetToken(userRecord);
      this.agendaInstance.now('reset password mail', {
        token,
        user: userRecord,
      });
    } catch (error) {
      return error;
    }
  }

  public async ResetPassword({
    token,
    password,
    _id,
  }): Promise<{ user: User; token: string }> {
    const userRecord = await user.findOne({ _id });
    if (!userRecord) {
      throw new Error('no userRecord');
    }

    const payload = jwt.verify(token, userRecord.password) as User;
    if (!payload) {
      throw new Error('Invalid name or password');
    }

    await user.updateOne(
      { _id },
      {
        password: await argon2.hash(password, {
          salt: randomBytes(32),
        }),
      },
    );

    return;
  }

  private generateToken = (user: User) =>
    jwt.sign(
      {
        _id: user._id,
        name: user.name,
      },
      config.jwtSecret,
      { expiresIn: 3600, algorithm: 'HS256' },
    );

  private generatePasswordResetToken = ({ password, _id }) =>
    jwt.sign(
      {
        _id,
      },
      password,
      { expiresIn: 3600, algorithm: 'HS256' },
    );
}
