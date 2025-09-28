// api/chat.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    // Hanya terima POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Gunakan POST.' });
    }

    // Ambil API Key dari Environment Variable (cek di runtime)
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        console.error('GEMINI_API_KEY is not set in environment');
        return res.status(500).json({ error: 'GEMINI_API_KEY tidak diset di environment.' });
    }

    try {
        const { content } = req.body;
        if (!content || typeof content !== 'string') {
            return res.status(400).json({ error: 'Invalid content. Kirim { "content": "pesan Anda" }.' });
        }

        // Inisialisasi client di runtime (aman untuk serverless)
        const genAI = new GoogleGenerativeAI(API_KEY);

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Jawablah selalu dalam bahasa Indonesia. ${content}`;

        // Panggil model (tunggu hasil)
        const result = await model.generateContent(prompt);

        // Tangani beberapa bentuk response yang mungkin dikembalikan oleh SDK
        let text = '';

        if (result == null) {
            text = '';
        } else if (typeof result === 'string') {
            text = result;
        } else {
            const maybeResponse = result.response ?? result;
            if (maybeResponse) {
                if (typeof maybeResponse.text === 'function') {
                    // Beberapa SDK mengembalikan objek dengan method text() yang mengembalikan Promise
                    try {
                        text = await maybeResponse.text();
                    } catch (e) {
                        console.warn('response.text() failed, falling back to stringify', e);
                        text = typeof maybeResponse === 'string' ? maybeResponse : JSON.stringify(maybeResponse);
                    }
                } else if (typeof maybeResponse.output === 'string') {
                    text = maybeResponse.output;
                } else if (typeof maybeResponse === 'string') {
                    text = maybeResponse;
                } else {
                    // fallback: stringify untuk debugging (jangan paparkan objek sensitif)
                    text = JSON.stringify(maybeResponse);
                }
            } else {
                text = '';
            }
        }

        return res.status(200).json({ text });
    } catch (error) {
        console.error('Error in /api/chat:', error);
        return res.status(500).json({ error: 'Terjadi kesalahan pada server saat memanggil model.' });
    }
}