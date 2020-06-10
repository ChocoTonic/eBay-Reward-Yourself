const dotenv = require('dotenv');
const EBay = require('ebay-node-api');

dotenv.config();

const ebay = new EBay({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  body: {
    grant_type: 'client_credentials',
    scope: 'https://api.ebay.com/oauth/api_scope',
  },
});


module.exports = ebay;
