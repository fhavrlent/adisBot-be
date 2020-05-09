const axios = require('axios');
require('dotenv').config();

const instance = axios.create({});

// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common['Client-ID'] = process.env.CLIENT_ID;

exports.axios = instance;
