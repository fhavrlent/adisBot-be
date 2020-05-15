import { Service, Inject } from 'typedi';
import { Transporter } from 'nodemailer';

import { User } from '../models/user';
import config from '../config';

@Service()
export default class MailService {
  @Inject('emailClient') private emailClient: Transporter;

  public async SendPasswordResetMail(user: User, token: string) {
    const url = `${config.baseFeUrl}/user/password-reset/${user._id}/${token}`;
    try {
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
    } catch (error) {}
  }
}
