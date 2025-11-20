export default async function handler(request, response) {
  // Hanya izinkan POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = request.body;

  if (!message) {
    return response.status(400).json({ error: 'Message is required' });
  }

  try {
    // 🔑 API KEY DISIMPAN DI VERCAL ENVIRONMENT VARIABLES
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set');
      return response.status(500).json({ error: 'Server configuration error' });
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile", // atau model lain
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const groqData = await groqResponse.json();

    if (!groqResponse.ok) {
      console.error('Groq API error:', groqData);
      return response.status(500).json({ error: 'Failed to get response from AI' });
    }

    const aiResponse = groqData.choices[0]?.message?.content || 'No response from AI.';

    // Kirim hanya respons AI, tanpa metadata sensitif
    response.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error('Server error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}
 </script>
     </body>
         </html>
                    
