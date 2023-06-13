const config = require('../config')
const querystring = require('querystring')
const axios = require('axios')

const getUserId = ((req, res) => {
    const userId = req.params.id

    axios.get(`https://api.spotify.com/v1/users/${userId}`, {
        headers: {
            'Authorization': 'Bearer ' + config.accessToken
        }
    }).then(response => {
        res.send(response.data)
    }).catch(error => {
        console.log(error);
    });
})

const getUserPlaylists = ((req, res) => {
    const userId = req.params.id
    
    axios.get(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: {
            'Authorization': 'Bearer ' + config.accessToken
        }
    }).then(response => {
        res.send(response.data)
    }).catch(error => {
        console.log(error);
    });
})

const getUserAuthorization = ((req, res) => {
    const redirect_uri = 'http://localhost:3000'
    let state = generateRandomString(16)
    let scope = 'user-read-library'

    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    }))
})

module.exports = {
    getUserId,
    getUserPlaylists,
    getUserAuthorization
}

