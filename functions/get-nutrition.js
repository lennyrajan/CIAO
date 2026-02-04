const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const { query } = event.queryStringParameters;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!query) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Query parameter required' }) };
    }

    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfiguration: API Key missing' }) };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
  Analyze this food query: "${query}". 
  The query may contain multiple food items or a single meal description.
  
  Return a STRICT JSON array of objects. 
  Each object MUST follow this format:
  {
    "name": "Display name of item",
    "calories": number (integer),
    "protein_g": number (float),
    "carbohydrates_total_g": number (float),
    "fat_total_g": number (float),
    "fiber_g": number (float),
    "saturated_fat_g": number (float),
    "serving_size_g": number (float, estimate standard weight if not specified)
  }

  Rules:
  1. Identify all distinct food/drink items. Handle typos gracefully (e.g., "chocken" -> "chicken").
  2. If the user says "one apple", use ~182g. If "one coffee with milk", estimate the coffee + milk volume.
  3. For complex dishes like "chicken biriyani", provide macros for a standard portion (e.g., 350-500g). Do not just return "chicken".
  4. If a meal prefix exists (e.g., "dinner:"), ignore the prefix but use it to contextually understand following items.
  5. RETURN ONLY THE RAW JSON ARRAY. No markdown, no triple backticks.
  `;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Gemini API Error', details: errorData })
            };
        }


        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
