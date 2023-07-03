require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const playlistSchema = {
  id: {
    type: 'number',
    description: 'A unique identifier for the playlist, initially set to -1',
  },
  playlist_name: {
    type: 'string',
    description: 'A creative name for the playlist',
  },
  playlist_description: {
    type: 'string',
    description: 'A creative description of the playlist',
  },
};

const trackSchema = {
  name: {
    type: 'string',
    description: 'The name of the track',
  },
  artist: {
    type: 'string',
    description: 'The name of the artist',
  },
  id: {
    type: 'string',
    description:
      'The unique identifier of the track, same as the Spotify track ID included in the input',
  },
};

const getNamesAndDescriptions = async (req, res) => {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0613',
      messages: [
        {
          role: 'system',
          content:
            "You are a helpful assistant that generates creative playlist ideas. Return an array of JSON objects, where each object represents a playlist and should have the properties 'id', 'playlist_name', and 'playlist_description'.",
        },
        {
          role: 'user',
          content:
            "I'm trying to organize a list of songs into playlists. Based on some common moods/emotions that music tries to evoke in its listeners, generate 5 creative and unique playlist names and their corresponding descriptions.",
        },
      ],
      functions: [
        {
          name: 'getNamesAndDescriptions',
          description: 'Generates playlist names and descriptions',
          parameters: {
            type: 'object',
            description:
              'An object containing an array of objects representing playlists',
            properties: {
              playlists: {
                type: 'array',
                description:
                  'An array of objects representing playlists, with the three properties: id, playlist_name, and playlist_description',
                items: playlistSchema,
              },
            },
            required: ['id', 'playlist_name', 'playlist_description'],
          },
        },
      ],
      function_call: 'auto',
      temperature: 1.2,
    });

    const data = completion.data.choices[0].message.function_call.arguments;
    res.json(JSON.parse(data)); // send response to client
  } catch (error) {
    console.error(error.response.data.error);
    res.status(500).json({ error: error.toString() }); // send error to client
  }
};

const getNameAndDescriptionByKeyword = async (req, res) => {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0613',
      messages: [
        {
          role: 'system',
          content:
            "You are a helpful assistant that generates creative playlist ideas. Return a JSON object that represents a playlist, with the properties 'id', 'playlist_name', and 'playlist_description'.",
        },
        {
          role: 'user',
          content: `I'm trying to organize a list of songs into playlists. Generate a creative and unique playlist name and a corresponding description in JSON format related to the following keywords: ${req.params.keywords}.`,
        },
      ],
      functions: [
        {
          name: 'getNameAndDescriptionByKeyword',
          description: 'Generates playlist names and descriptions',
          parameters: {
            type: 'object',
            description: 'An object representing a playlist',
            properties: playlistSchema,
            required: ['id', 'playlist_name', 'playlist_description'],
          },
        },
      ],
      function_call: 'auto',
      temperature: 1.2,
    });

    const data = completion.data.choices[0].message.function_call.arguments;
    res.json(JSON.parse(data)); // send response to client
  } catch (error) {
    console.log(error.response.data.error);
    res.status(500).json({ error: error.toString() }); // send error to client
  }
};

const generatePlaylists = async (req, res) => {
  const playlistString = req.body.playlists
    .map(
      (playlist) =>
        playlist.playlist_name + ' - ' + playlist.playlist_description
    )
    .join('\n');
  const trackString = req.body.tracks
    .map((track) => track.name + ' - ' + track.artist + ` (id: ${track.id})`)
    .join('\n');

  try {
    // Request a chat completion from OpenAI's model
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0613',
      messages: [
        {
          role: 'system',
          content:
            "As a skillful assistant with music expertise, your job is to sort songs into playlists. The criteria for categorization includes mood, lyrics, tempo, and more. Each playlist in the 'playlists' array must contain: 'playlist_name', 'playlist_description', and 'tracks'. Each 'track' should have 'name', 'artist', and 'id'.",
        },
        {
          role: 'user',
          content: `Given the following list of playlists: \n${playlistString}\n and the following list of songs: \n${trackString}\n organize the songs into the playlists via the provided JSON format. If a song doesn't fit in any playlist, place it in leftover_tracks.`,
        },
      ],
      functions: [
        {
          name: 'generatePlaylists',
          description:
            'This function generates playlists from a given list of tracks. The playlists are created based on factors such as song mood, lyrics, tempo, and more. Each playlist has its own name and description.',
          parameters: {
            type: 'object',
            description:
              'This object represents a collection of generated playlists.',
            properties: {
              playlists: {
                type: 'array',
                description:
                  'This array contains objects representing individual playlists and their corresponding tracks.',
                items: {
                  playlist_name: {
                    type: 'string',
                    description: 'The name of the playlist.',
                  },
                  playlist_description: {
                    type: 'string',
                    description: 'The description of the playlist.',
                  },
                  tracks: {
                    type: 'array',
                    description:
                      'This array contains objects representing the tracks within the playlist.',
                    items: trackSchema,
                  },
                },
              },
              leftover_tracks: {
                type: 'array',
                description:
                  'This array contains objects representing the tracks that did not fit into any playlist.',
                items: trackSchema,
              },
            },
            required: [
              'playlists',
              'leftover_tracks',
              'id',
              'playlist_name',
              'playlist_description',
              'name',
              'artist',
            ],
          },
        },
      ],
      function_call: 'auto',
      temperature: 1.2,
    });

    // Extract the arguments from the function call in the model's output
    const data = completion.data.choices[0].message.function_call.arguments;

    // Send the sorted playlists back to the client
    res.json(JSON.parse(data));
  } catch (error) {
    // Log the error and send it back to the client
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = {
  getNamesAndDescriptions,
  getNameAndDescriptionByKeyword,
  generatePlaylists,
};
