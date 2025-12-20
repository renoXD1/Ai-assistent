const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// AI Scraper - General Conversation
async function callDeepSeekAI(message) {
    try {
        console.log(`🤖 Request to DeepSeek: "${message.substring(0, 50)}..."`);
        
        const response = await axios.post('https://wewordle.org/gptapi/v1/web/turbo', {
            messages: [{ 
                content: message, 
                role: "user" 
            }]
        }, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 15; 23124RA7EO Build/AQ3A.240829.003) AppleWebKit/537.36',
                'Content-Type': 'application/json',
                'Origin': 'https://deepseek.me',
                'Referer': 'https://deepseek.me/',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
            },
            timeout: 30000
        });

        console.log('✅ DeepSeek response received');
        return response.data?.message?.content || 'Tidak ada respons dari AI';

    } catch (error) {
        console.error('❌ Scraper error:', error.message);
        
        // Smart fallback based on message content
        if (message.toLowerCase().includes('kode') || 
            message.toLowerCase().includes('coding') || 
            message.toLowerCase().includes('program')) {
            
            // Coding-related fallback
            const codeExamples = {
                javascript: `console.log("Halo! Ini contoh kode JavaScript");\n\nfunction sapa(nama) {\n    return "Halo, " + nama + "!";\n}`,
                python: `print("Halo! Ini contoh kode Python")\n\ndef sapa(nama):\n    return f"Halo, {nama}!"`,
                html: `<!DOCTYPE html>\n<html>\n<head>\n    <title>Contoh HTML</title>\n</head>\n<body>\n    <h1>Halo!</h1>\n</body>\n</html>`
            };
            
            const lang = message.toLowerCase().includes('python') ? 'python' : 
                        message.toLowerCase().includes('html') ? 'html' : 'javascript';
            
            return `Saya tidak bisa mengakses AI saat ini, tapi ini contoh kode ${lang.toUpperCase()}:\n\n\`\`\`${lang}\n${codeExamples[lang]}\n\`\`\``;
            
        } else {
            // General conversation fallback
            const generalResponses = [
                `Halo! 👋 Saya DeepSeek AI.\n\nAnda berkata: "${message}"\n\nSebagai teman bicara, saya senang ngobrol dengan Anda! Apa yang ingin kita bahas?`,
                `Saya mendengar: "${message}"\n\nMaaf, koneksi ke AI sedang tidak stabil. Tapi saya tetap di sini sebagai teman bicara! 😊\n\nIngin cerita tentang apa hari ini?`,
                `DeepSeek AI di sini! 🎯\n\n"${message}" - menarik sekali!\n\nSaya bisa membantu dengan berbagai topik:\n• Kehidupan sehari-hari\n• Hobi & minat\n• Teknologi\n• Atau apapun yang Anda ingin bicarakan!\n\nAyo lanjutkan obrolan!`
            ];
            
            return generalResponses[Math.floor(Math.random() * generalResponses.length)];
        }
    }
}

// API Route for chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                error: 'Pesan tidak valid',
                success: false 
            });
        }

        const response = await callDeepSeekAI(message);
        
        res.json({ 
            success: true, 
            response,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'DeepSeek AI - Teman Bicara',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        description: 'AI Chat untuk percakapan umum & coding'
    });
});

// Home route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    console.log(`💬 Mode: Teman Bicara & Asisten`);
    console.log(`✨ Fitur: Percakapan umum + Blok kode`);
});
