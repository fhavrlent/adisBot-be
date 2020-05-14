import axios from 'axios';

import config from './config';

const krakenApi = axios.create({
  baseURL: 'https://api.twitch.tv/kraken/',
  headers: {
    'Client-ID': config.clientId,
    Accept: 'application/vnd.twitchtv.v5+json',
  },
});

export { krakenApi };
