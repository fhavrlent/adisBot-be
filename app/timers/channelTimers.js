const { getStreamData } = require('../services/ChannelService');

// eslint-disable-next-line no-unused-vars
const isOnline = () =>
  setInterval(async () => {
    const { data } = await getStreamData();
    return !!data;
  }, 60 * 1000);

//TODO: WORK IN PROGRESS
