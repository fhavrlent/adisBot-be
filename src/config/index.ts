import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  corsOrigin: process.env.CORS_ORIGIN,
  baseFeUrl: process.env.BASE_FE_URL,

  /**
   * Twitch
   */

  channel: process.env.CHANNEL,
  channelId: process.env.CHANNEL_ID,
  clientId: process.env.CLIENT_ID,

  /**
   * Mongo
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * Agenda.js stuff
   */
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  /**
   * Sentry
   */
  sentry: {
    dsn: process.env.SENTRY_DNS,
  },

  /**
   * Mail data
   */

  mailLogin: process.env.MAIL_LOGIN,
  mailPassword: process.env.MAIL_LOGIN,
  mailSendFrom: process.env.EMAIL_SEND_FROM,
};