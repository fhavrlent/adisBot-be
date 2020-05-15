import Container from 'typedi';
import { Transporter } from 'nodemailer';
import config from '../config';
import MailService from '../services/email';

module.exports = function (agenda) {
  agenda.define('reset password mail', async (job, done) => {
    try {
      const mailService = Container.get(MailService);
      const { user, token } = job.attrs.data;
      mailService.SendPasswordResetMail(user, token);
      done();
    } catch (error) {
      done(error);
    }
  });
};
