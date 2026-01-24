// CIAO Nutrition: API Integration

window.CIAO = window.CIAO || {};

window.CIAO.Nutrition = {

    // Fallback dictionary for common items (per 100g approx, or per unit)
    OFFLINE_DB: {
        // Proteins
        'chicken': { protein: 31, fat: 3.6, carbs: 0, calories: 165 }, // Breast
        'chicken breast': { protein: 31, fat: 3.6, carbs: 0, calories: 165 },
        'egg': { protein: 13, fat: 11, carbs: 1.1, calories: 155, unit_g: 50 }, // ~50g per egg
        'eggs': { protein: 13, fat: 11, carbs: 1.1, calories: 155, unit_g: 50 },
        'beef': { protein: 26, fat: 19, carbs: 0, calories: 250 }, // Ground 85%
        'steak': { protein: 25, fat: 19, carbs: 0, calories: 271 },
        'salmon': { protein: 20, fat: 13, carbs: 0, calories: 208 },
        'tuna': { protein: 28, fat: 1, carbs: 0, calories: 132 }, // Canned in water
        'whey': { protein: 75, fat: 5, carbs: 5, calories: 370 },
        'yogurt': { protein: 10, fat: 0.4, carbs: 3.6, calories: 59 }, // Greek non-fat
        'tofu': { protein: 8, fat: 4.8, carbs: 1.9, calories: 76 },

        // Carbs
        'rice': { protein: 2.7, fat: 0.3, carbs: 28, calories: 130 }, // White cooked
        'white rice': { protein: 2.7, fat: 0.3, carbs: 28, calories: 130 },
        'brown rice': { protein: 2.6, fat: 0.9, carbs: 23, calories: 111 },
        'oats': { protein: 16.9, fat: 6.9, carbs: 66, calories: 389 }, // Raw
        'potato': { protein: 2, fat: 0.1, carbs: 17, calories: 77 },
        'sweet potato': { protein: 1.6, fat: 0.1, carbs: 20, calories: 86 },
        'pasta': { protein: 5, fat: 1.1, carbs: 25, calories: 131 }, // Cooked
        'bread': { protein: 9, fat: 3.2, carbs: 49, calories: 265, unit_g: 30 }, // ~30g slice
        'banana': { protein: 1.1, fat: 0.3, carbs: 23, calories: 89, unit_g: 118 }, // Medium
        'apple': { protein: 0.3, fat: 0.2, carbs: 14, calories: 52, unit_g: 180 }, // Medium

        // Fats
        'avocado': { protein: 2, fat: 15, carbs: 9, calories: 160, unit_g: 150 }, // Half/Medium
        'oil': { protein: 0, fat: 100, carbs: 0, calories: 884, unit_g: 14 }, // TBSP
        'olive oil': { protein: 0, fat: 100, carbs: 0, calories: 884, unit_g: 14 },
        'butter': { protein: 0.9, fat: 81, carbs: 0.1, calories: 717, unit_g: 14 },
        'peanut butter': { protein: 25, fat: 50, carbs: 20, calories: 588, unit_g: 32 }, // 2 tbsp
        'almonds': { protein: 21, fat: 49, carbs: 22, calories: 575 },

        // Vege
        'broccoli': { protein: 2.8, fat: 0.4, carbs: 7, calories: 34 },
        'spinach': { protein: 2.9, fat: 0.4, carbs: 3.6, calories: 23 },
    },

    /**
     * Parse simple quantity from string if using offline mode
     * Supports: "300g chicken", "2 eggs", "1 banana"
     */
    parseOfflineQuery: function (query) {
        const lower = query.toLowerCase();

        // 1. Find food match
        let match = null;
        let matchName = '';
        for (const [key, data] of Object.entries(this.OFFLINE_DB)) {
            // Check for whole word match or strong substring
            if (lower.includes(key)) {
                if (!match || key.length > matchName.length) { // Longest match wins
                    match = data;
                    matchName = key;
                }
            }
        }

        if (!match) return null;

        // 2. Extract Quantity
        let amount = 0;
        const numberMatch = lower.match(/((\d+(\.\d+)?))/); // Matches int or float
        const rawNumber = numberMatch ? parseFloat(numberMatch[0]) : null;

        // 3. Determine Unit Type (Weight vs Count)
        const isGram = lower.includes('g') || lower.includes('gram') || lower.includes('ml');
        const isUnit = !isGram && match.unit_g; // If no gram specified and item has a unit weight, assume count

        if (rawNumber !== null) {
            if (isUnit) {
                // "2 eggs" -> 2 * unit_g
                amount = rawNumber * match.unit_g;
            } else {
                // "300 chicken" -> assume 300g
                amount = rawNumber;
            }
        } else {
            // No number found ("egg", "chicken")
            if (match.unit_g) amount = match.unit_g; // 1 unit
            else amount = 100; // Default 100g
        }

        // 4. Calculate stats
        const factor = amount / 100; // Database is per 100g

        return {
            name: matchName + ` (${amount}g)`,
            calories: typeof match.calories === 'number' ? Math.round(match.calories * factor) : 0,
            protein: typeof match.protein === 'number' ? Math.round(match.protein * factor) : 0,
            fat: typeof match.fat === 'number' ? Math.round(match.fat * factor) : 0,
            carbs: typeof match.carbs === 'number' ? Math.round(match.carbs * factor) : 0,
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
