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
  Return a STRICT JSON array of objects with nutritional estimates. 
  Format: [{"name": string, "calories": number, "protein_g": number, "carbohydrates_total_g": number, "fat_total_g": number}].
  If quantity is not specified, estimate a standard serving size.
  Do not include Markdown formatting (like \`\`\`json). Just the raw JSON string.
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
            return { statusCode: response.status, body: JSON.stringify({ error: 'Gemini API Error' }) };
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
