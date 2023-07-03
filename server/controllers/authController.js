const querystring = require('querystring');
const axios = require('axios');
const config = require('../config');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

// Your application's client ID and redirect URI
const client_id = 'be4c953fbc71461a85c3dbe065a32fb4';
const client_secret = 'd5160ab0275046aebc84e959d596ac64';
const redirect_uri = process.env.REDIRECT_URI;
const scope = 'user-library-read'; // Modify the scopes as needed

const authRequest = (req, res) => {
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
      })
  );
};

const getAccessToken = async (req, res) => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code: req.params.code,
        redirect_uri,
        client_id,
        client_secret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.json(response.data); // send response to client
    config.accessToken = response.data.access_token;
  } catch (error) {
    console.error(error.response.data.error); // log error for debugging
    res.status(500).json({ error: error.toString() }); // send error to client
  }
};

module.exports = { authRequest, getAccessToken };
