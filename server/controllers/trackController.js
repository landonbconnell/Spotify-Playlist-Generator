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
          tracks.push({
            name: item.track.name,
            artist: item.track.artists[0].name,
            release_date: item.track.album.release_date,
            genres: item.track.album.genres,
            id: item.track.id
          });
        }
  
        url = response.data.next;
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching tracks.' });
      }
    }
  
    res.json(tracks);
  };
  
  module.exports = getSavedTracks;
  

