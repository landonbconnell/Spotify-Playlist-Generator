const config = require('../config')
const axios = require('axios')

const getSavedTracks = async (req, res) => {
    let url = 'https://api.spotify.com/v1/me/tracks?offset=0&limit=50';
    let tracks = [];
  
    while (url) {
      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': 'Bearer ' + config.accessToken
          }
        });
  
        for (let item of response.data.items) {
          tracks.push(`${item.track.name} - ${item.track.artists[0].name}`);
        }
  
        url = response.data.next;
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching tracks.' });
      }
    }
  
    res.send(tracks);
  };
  
  module.exports = getSavedTracks;
  

