const axios = require('axios');

const apiKey = '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';

const getNamesAndDescriptions = async (req, res) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', 
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: "You are an assistant that ONLY speaks JSON. Return a aingle JSON array of objects. Each object represents a playlist and should have the properties 'id', 'name', and 'description'. The 'id' should be a number, 'name' should be the playlist name, and 'description' should describe the kind of music or mood of the playlist. DO NOT return any text outside the JSON array. The very first character should be '[' and the very last character should be ']'. You are not permitted to return introductions, explanations, or any other non-JSON text." },
                    { role: 'user', content: "I'm trying to organize a list of songs into playlists. Based on some common moods/emotions that music tries to evoke in its listeners, generate 5 creative and unique playlist names and corresponding descriptions in JSON format." }
                ],
                temperature: 0.8
            }, 
            { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        )

        let str = response.data.choices[0].message.content;
        const start = str.indexOf('[');
        const end = str.indexOf(']');
    
        console.log(str)

        if (start !== -1 && end !== -1 && start < end) {
            str = str.substring(start, end + 1);
        } else {
            str = [];
        }

        res.json(JSON.parse(str));  // send response to client/
    } catch (error) {
        console.error(error);  // log error for debugging
        res.status(500).json({ error: error.toString() });  // send error to client
    }
}

module.exports = { getNamesAndDescriptions }