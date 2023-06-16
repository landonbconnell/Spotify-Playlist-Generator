const axios = require('axios');

const apiKey = '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';

const getNamesAndDescriptions = async (req, res) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', 
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: "You are an assistant that ONLY speaks JSON and does NOT speak natural language. Each object in the array should contain three attributes: id, playListName, and description. Do not write normal text." },
                    { role: 'user', content: "I'm trying to organize a list of songs into playlist. Based on some common moods/emotions that music tries to evoke in its listeners, generate 2 playlist names and corresponding descriptions." }
                ],
                temperature: 1
            }, 
            { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        )

        res.json(JSON.parse(response.data.choices[0].message.content));  // send response to client/
    } catch (error) {
        console.error(error);  // log error for debugging
        res.status(500).json({ error: error.toString() });  // send error to client
    }
}

module.exports = { getNamesAndDescriptions }