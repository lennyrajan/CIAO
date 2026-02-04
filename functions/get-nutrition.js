// Use native fetch (Node 18+) to avoid dependency issues with node-fetch
exports.handler = async function (event, context) {
    const { query } = event.queryStringParameters;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!query) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Query parameter required' }) };
    }

    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfiguration: GOOGLE_API_KEY missing' }) };
    }

    const models = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.0-pro'];
    let lastError = null;

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
    "serving_size_g": number (float)
  }

  Rules:
  1. Identify all distinct food/drink items. Handle typos (e.g., "chocken" -> "chicken").
  2. If the user says "one apple", use ~182g. If "one coffee with milk", estimate the coffee + milk volume.
  3. MANDATORY: For composite dishes like "chicken biriyani", "pizza", "burger", "one plate biriyani", etc., YOU MUST return the macros for the ENTIRE DISH as a single item. DO NOT just return the main ingredient (like chicken). A standard plate of biriyani is ~350-500g and ~500-800kcal.
  4. If a meal prefix exists (e.g., "dinner:"), ignore the prefix but use it to contextually understand following items.
  5. RETURN ONLY THE RAW JSON ARRAY. No markdown, no triple backticks.
  `;

    for (const model of models) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        console.log(`Attempting Gemini API with model: ${model}...`);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`Success with model: ${model}`);
                return {
                    statusCode: 200,
                    body: JSON.stringify(data)
                };
            }

            const errorText = await response.text();
            console.warn(`Model ${model} failed with ${response.status}: ${errorText}`);
            lastError = { status: response.status, text: errorText, model };

            // If it's a 404, we continue to the next model. 
            // If it's a 429 (quota) or 400 (bad prompt), we might want to stop, 
            // but for safety let's try the next model regardless of the error type if it's not a success.
            continue;

        } catch (error) {
            console.error(`Fetch error for model ${model}:`, error);
            lastError = { status: 500, text: error.message, model };
            continue;
        }
    }

    // If we reach here, all models failed
    return {
        statusCode: lastError.status || 500,
        body: JSON.stringify({
            error: 'All Gemini models failed',
            last_attempted: lastError.model,
            details: lastError.text
        })
    };
};
