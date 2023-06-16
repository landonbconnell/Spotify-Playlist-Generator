// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Set your base URL in a .env file
});

export const fetchTracks = () =>
  api.get('/tracks/saved').then(response => response.data);

export const fetchPlaylistNamesAndDescriptions = () =>
  api.get('/playlists/getNamesAndDescriptions').then(response => response.data);