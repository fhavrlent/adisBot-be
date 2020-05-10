const axios = require('axios');
require('dotenv').config();

const instance = axios.create({});

instance.defaults.headers.common['Client-ID'] = process.env.CLIENT_ID;

exports.axios = instance;
