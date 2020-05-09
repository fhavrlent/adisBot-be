const Sentry = require('@sentry/node');

const axios = require('../../axiosConfig');

const { CHANNEL, TWITCH_ID } = process.env;

const getViewers = async () => {
  try {
    return await axios.get(
      `https://tmi.twitch.tv/group/user/${CHANNEL}/chatters`,
    );
  } catch (error) {
    Sentry.captureException(error);
  }
};

const getStreamData = async () => {
  try {
    return await axios.get(
      `https://api.twitch.tv/helix/streams?user_id=${TWITCH_ID}`,
    );
  } catch (error) {
    Sentry.captureException(error);
  }
};

module.exports = { getViewers, getStreamData };
