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

    try {
        // 1. DISCOVERY PHASE: Find out what models this API key actually supports
        // We use the 'x-goog-api-key' header instead of the ?key= query param for better compatibility
        const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models`;
        console.log("Discovering available models with x-goog-api-key...");

        const listResponse = await fetch(listModelsUrl, {
            headers: { 'x-goog-api-key': apiKey }
        });

        if (!listResponse.ok) {
            const listErrText = await listResponse.text();
            console.error("Discovery failed:", listResponse.status, listErrText);
            return {
                statusCode: listResponse.status,
                body: JSON.stringify({ error: 'Gemini Discovery Failed', details: listErrText })
            };
        }

        const listData = await listResponse.json();
        const availableModels = listData.models || [];

        // Filter for models that support 'generateContent'
        const compatibleModels = availableModels.filter(m =>
            m.supportedGenerationMethods.includes('generateContent')
        );

        if (compatibleModels.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'No compatible Gemini models found for this API key.', found: availableModels.map(m => m.name) })
            };
        }

        // Discovery Logic: Prefer gemini-3, then gemini-2, then gemini-1.5-flash
        compatibleModels.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();

            // Priority 1: Gemini 3
            if (aName.includes('gemini-3') && !bName.includes('gemini-3')) return -1;
            if (!aName.includes('gemini-3') && bName.includes('gemini-3')) return 1;

            // Priority 2: Gemini 2
            if (aName.includes('gemini-2') && !bName.includes('gemini-2')) return -1;
            if (!aName.includes('gemini-2') && bName.includes('gemini-2')) return 1;

            // Priority 3: Gemini 1.5-flash
            if (aName.includes('flash') && !bName.includes('flash')) return -1;
            if (!aName.includes('flash') && bName.includes('flash')) return 1;

            return 0;
        });

        const targetModel = compatibleModels[0].name; // e.g. 'models/gemini-3-flash-preview'
        console.log(`Success! Using discovered model: ${targetModel}`);

        // 2. GENERATION PHASE
        const url = `https://generativelanguage.googleapis.com/v1beta/${targetModel}:generateContent`;

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

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (response.ok) {
            const data = await response.json();
            return {
                statusCode: 200,
                body: JSON.stringify(data)
            };
        }

        const errorText = await response.text();
        console.error(`Generation failed for ${targetModel}:`, response.status, errorText);
        return {
            statusCode: response.status,
            body: JSON.stringify({ error: 'Gemini Generation Failed', model: targetModel, details: errorText })
        };

    } catch (error) {
        console.error("Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Internal Server Error: ${error.message}` })
        };
    }
};
