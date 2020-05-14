import { Service, Inject } from 'typedi';
import nodemailer, { Transporter } from 'nodemailer';

import config from '../config';
import { User } from '../models/user';

@Service()
export default class MailService {
  constructor(@Inject('emailClient') private emailClient: Transporter) {}

  public async SendPasswordResetMail(user: User, token: string) {
    try {
      const url = `${config.baseFeUrl}/user/password-reset/${user._id}/${token}`;

      const resetPasswordTemplate = {
        from: config.mailSendFrom,
        to: user.email,
        subject: '🚀 Adisbot Password Reset 🚀',
        html: `
        <p>Hey ${user.name || user.email},</p>
        <p>You can use the following link to reset your password:</p>
        <a href=${url}>${url}</a>
        <p>If you don’t use this link within 1 hour, it will expire.</p>
        `,
      };
      await this.emailClient.sendMail(resetPasswordTemplate);

      return;
    } catch (error) {}
  }
}
