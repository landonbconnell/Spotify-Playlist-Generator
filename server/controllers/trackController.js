const config = require('../config')
const axios = require('axios')

const getSavedTracks = ((req, res) => {

    axios.get('https://api.spotify.com/v1/me/tracks', {
        headers: {
            'Authorization': 'Bearer ' + config.accessToken
        }
    }).then(response => {
        res.send(response.data)
    }).catch(error => {
        console.log(error);
    });
})

module.exports = getSavedTracks

