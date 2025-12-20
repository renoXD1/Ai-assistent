const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// YOUR SCRAPER - Backend version
async function scrapeDeepSeek(message) {
    try {
        const response = await axios.post('https://wewordle.org/gptapi/v1/web/turbo', {
            messages: [{ content: message, role: "user" }]
        }, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 15; 23124RA7EO Build/AQ3A.240829.003) AppleWebKit/537.36',
                'Content-Type': 'application/json',
                'Origin': 'https://deepseek.me',
                'Referer': 'https://deepseek.me/',
                'Accept-Language': 'id-ID,id;q=0.9'
            }
        });

        return response.data?.message?.content || 'No response';

    } catch (error) {
        console.error('Scraper error:', error.message);
        
        // Fallback 1: Try alternative endpoint
        try {
            const fallback = await axios.post('https://chatgpt-api.shn.hk/v1/', {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }]
            });
            return fallback.data.choices?.[0]?.message?.content || 'Fallback response';
        } catch (err) {
            // Fallback 2: Return mock response
            return `DeepSeek AI (Simulasi): Saya menerima pesan "${message}". Endpoint mungkin sedang tidak tersedia.`;
        }
    }
}

// API Route for chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message required' });

        const response = await scrapeDeepSeek(message);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Home route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Static files served from: ${__dirname}`);
});
