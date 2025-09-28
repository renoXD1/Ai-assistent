# Ai-assistent

Proyek ini adalah AI Assistant sederhana yang menggunakan Google Gemini (melalui paket @google/generative-ai) sebagai backend model, dan frontend statis (index.html) sebagai UI chat.

Perubahan yang saya usulkan pada branch fix/gemini-api-errors:
- Memperbaiki api/chat.js agar:
  - Memeriksa method (hanya POST).
  - Mengecek API key di runtime (tidak melempar error saat import).
  - Validasi input body.content.
  - Menangani beberapa bentuk response dari SDK (menggunakan await response.text() bila perlu).
  - Menambahkan logging error yang lebih jelas.

Cara menjalankan lokal:
1. Install dependencies:
   npm install

2. Set environment variable GEMINI_API_KEY:
   - macOS / Linux:
     export GEMINI_API_KEY="YOUR_KEY"
   - Windows PowerShell:
     $env:GEMINI_API_KEY="YOUR_KEY"

3. Jalankan development (Vercel recommended):
   npm run start
   atau
   vercel dev

4. Test endpoint:
   curl -X POST -H "Content-Type: application/json" -d '{"content":"Halo, apa kabar?"}' http://localhost:3000/api/chat

Catatan penting:
- Jangan commit API key ke repository. Gunakan environment variables (mis. set di dashboard Vercel saat deploy).
- Jika Anda mengalami error berkaitan dengan ESM (import), pastikan package.json memiliki "type": "module" atau gunakan sintaks CommonJS.
