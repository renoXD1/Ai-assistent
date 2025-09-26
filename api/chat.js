// api/chat.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ambil API Key dari Environment Variable Vercel (INI PENTING)
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not set as an environment variable.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export default async function handler(req, res) {
    try {
        const { content } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Jawablah selalu dalam bahasa Indonesia. ${content}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ text: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
}
