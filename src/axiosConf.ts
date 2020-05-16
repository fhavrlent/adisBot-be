import axios from 'axios';

import config from './config';

const krakenApi = axios.create({
  baseURL: 'https://api.twitch.tv/kraken/',
  headers: {
    'Client-ID': config.clientId,
    Accept: 'application/vnd.twitchtv.v5+json',
  },
});

const kappaApi = axios.create({
  baseURL: 'https://api.streamelements.com/kappa/v2/',
  headers: {
    Authorization: config.streamelementsBearer,
  },
});

export { krakenApi, kappaApi };
