// CIAO Nutrition: API Integration

window.CIAO = window.CIAO || {};

window.CIAO.Nutrition = {

    // Fallback dictionary for common items (per 100g approx)
    OFFLINE_DB: {
        'chicken': { protein: 31, fat: 3.6, carbs: 0, calories: 165 }, // Breast
        'chicken breast': { protein: 31, fat: 3.6, carbs: 0, calories: 165 },
        'egg': { protein: 13, fat: 11, carbs: 1.1, calories: 155 },
        'rice': { protein: 2.7, fat: 0.3, carbs: 28, calories: 130 }, // Cooked regular
        'white rice': { protein: 2.7, fat: 0.3, carbs: 28, calories: 130 },
        'beef': { protein: 26, fat: 19, carbs: 0, calories: 250 }, // Ground 85%
        'potato': { protein: 2, fat: 0.1, carbs: 17, calories: 77 },
        'apple': { protein: 0.3, fat: 0.2, carbs: 14, calories: 52 },
        'banana': { protein: 1.1, fat: 0.3, carbs: 23, calories: 89 },
        'oats': { protein: 16.9, fat: 6.9, carbs: 66, calories: 389 },
        'whey': { protein: 75, fat: 5, carbs: 5, calories: 370 }, // Powder
        'salmon': { protein: 20, fat: 13, carbs: 0, calories: 208 }, // Generic Atlantic

    },

    /**
     * Parse simple quantity from string if using offline mode
     * Supports: "300g chicken", "100 grams rice", "chicken 200"
     */
    parseOfflineQuery: function (query) {
        const lower = query.toLowerCase();

        // Find food match
        let match = null;
        let matchName = '';
        for (const [key, data] of Object.entries(this.OFFLINE_DB)) {
            if (lower.includes(key)) {
                if (!match || key.length > matchName.length) { // Longest match wins
                    match = data;
                    matchName = key;
                }
            }
        }

        if (!match) return null;

        // Try to find quantity (default 100g)
        let amount = 100; // grams
        // Extract numbers
        const numbers = lower.match(/(\d+)/);
        if (numbers) {
            amount = parseFloat(numbers[0]);
        }

        // Scale factors
        const factor = amount / 100;

        return {
            name: matchName + ` (${amount}g)`,
            calories: match.calories * factor,
            protein: match.protein * factor,
            fat: match.fat * factor,
            carbs: match.carbs * factor,
            serving_size_g: amount,
            source: 'OFFLINE_DB'
        };
    },

    /**
     * Fetch from CalorieNinjas
     */
    /**
     * Fetch from Netlify Function (proxies to Gemini)
     * @param {string} query Natural language query
     */
    fetchNutrition: async function (query) {
        if (!query) return [];

        try {
            console.log(`Fetching nutrition for: ${query} via Netlify Function`);
            const url = `/.netlify/functions/get-nutrition?query=${encodeURIComponent(query)}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Netlify Function Error: " + response.statusText);
            }

            const data = await response.json();

            if (!data.candidates) {
                if (data.error) throw new Error("API Error: " + data.error);
                throw new Error("Invalid structure from API");
            }

            const textResponse = data.candidates[0].content.parts[0].text;
            const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const items = JSON.parse(jsonStr);

            return items;

        } catch (error) {
            console.warn("Netlify Service failed, falling back to offline.", error);
            const local = this.parseOfflineQuery(query);
            if (local) return [local];
            return [];
        }
    }
};
