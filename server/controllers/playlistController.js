require('dotenv').config()
const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getNamesAndDescriptions = async (req, res) => {
    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo-0613',
            messages: [
                { role: 'system', content: "You are a helpful assistant that generates creative playlist ideas. Return an array of JSON objects, where each object represents a playlist and should have the properties 'id', 'playlist_name', and 'playlist_description'." },
                { role: 'user', content: "I'm trying to organize a list of songs into playlists. Based on some common moods/emotions that music tries to evoke in its listeners, generate 5 creative and unique playlist names and their corresponding descriptions." }
            ],
            functions: [
                {
                    name: "getNamesAndDescriptions",
                    description: "Generates playlist names and descriptions",
                    parameters: {
                        type: "object",
                        description: "An object containing an array of objects representing playlists",
                        properties: {
                            playlists: {
                                type: "array",
                                description: "An array of objects representing playlists, with the three properties: id, playlist_name, and playlist_description",
                                items: {
                                    id: {
                                        type: "number",
                                        description: "A unique identifier for the playlist, initially set to -1"
                                    },
                                    playlist_name: {
                                        type: "string",
                                        description: "A creative name for the playlist"
                                    },
                                    playlist_description: {
                                        type: "string",
                                        description: "A creative description of the playlist"
                                    }
                                }
                            }
                        },
                        required: ["id", "playlist_name", "playlist_description"]
                    },
                }                
            ],            
            function_call: "auto",
            temperature: 1.2
        })

        const data = completion.data.choices[0].message.function_call.arguments;
        res.json(JSON.parse(data));  // send response to client

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.toString() });  // send error to client
    }
}

const getNameAndDescriptionByKeyword = async (req, res) => {
    try {
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo-0613',
            messages: [
                { role: 'system', content: "You are a helpful assistant that generates creative playlist ideas. Return a JSON object that represents a playlist, with the properties 'id', 'playlist_name', and 'playlist_description'." },
                { role: 'user', content: `I'm trying to organize a list of songs into playlists. Generate a creative and unique playlist name and a corresponding description in JSON format related to the following keywords: ${req.params.keywords}.` }
            ],
            functions: [
                {
                    name: "getNameAndDescriptionByKeyword",
                    description: "Generates playlist names and descriptions",
                    parameters: {
                        type: "object",
                        description: "An object representing a playlist",
                        properties: {
                            id: {
                                type: "number",
                                description: "A unique identifier for the playlist, initially set to -1"
                            },
                            playlist_name: {
                                type: "string",
                                description: "A creative name for the playlist"
                            },
                            playlist_description: {
                                type: "string",
                                description: "A creative description of the playlist"
                            }
                        },
                        required: ["id", "playlist_name", "playlist_description"]
                    },
                }                
            ],            
            function_call: "auto",
            temperature: 1.2
        })

        const data = completion.data.choices[0].message.function_call.arguments;
        res.json(JSON.parse(data));  // send response to client

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.toString() });  // send error to client
    }
}

module.exports = { getNamesAndDescriptions, getNameAndDescriptionByKeyword }