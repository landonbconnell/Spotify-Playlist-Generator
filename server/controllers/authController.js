const querystring = require('querystring');

// Your application's client ID and redirect URI
const client_id = 'be4c953fbc71461a85c3dbe065a32fb4';
const client_secret = 'd5160ab0275046aebc84e959d596ac64'
const redirect_uri = 'http://localhost:3000/home';
const scope = 'user-library-read';  // Modify the scopes as needed

const authRequest = ((req, res) => {
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri
    }));
})

const getAccessToken = (async (req, res) => {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', {
          grant_type: 'authorization_code',
          code: req.params.code,
          redirect_uri,
          client_id,
          client_secret
        }, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
    
        return response.data.access_token
    } catch (error) {
        return error
    }
})

module.exports = { authRequest, getAccessToken }
