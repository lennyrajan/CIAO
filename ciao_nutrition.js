// CIAO Nutrition: API Integration

window.CIAO = window.CIAO || {};

window.CIAO.Nutrition = {

    // Fallback dictionary for common items (per 100g approx, or per unit)
    OFFLINE_DB: {
        // --- PROTEIN SOURCES ---
        'chicken': { protein: 31, fat: 3.6, carbs: 0, calories: 165 },
        'chicken breast': { protein: 31, fat: 3.6, carbs: 0, calories: 165 },
        'chicken thigh': { protein: 26, fat: 15, carbs: 0, calories: 245 }, // Skin on
        'turkey': { protein: 29, fat: 1, carbs: 0, calories: 135 },
        'ground turkey': { protein: 27, fat: 12, carbs: 0, calories: 220 }, // 93% lean
        'egg': { protein: 13, fat: 10, carbs: 1, calories: 143, unit_g: 50 }, // Standard ~143kcal/100g. Unit 50g.
        'eggs': { protein: 13, fat: 10, carbs: 1, calories: 143, unit_g: 50 },
        'egg white': { protein: 11, fat: 0, carbs: 0.7, calories: 52, unit_g: 33 }, // ~52kcal/100g
        'beef': { protein: 26, fat: 19, carbs: 0, calories: 250 }, // Ground 85%
        'ground beef': { protein: 26, fat: 19, carbs: 0, calories: 250 },
        'lean beef': { protein: 21, fat: 5, carbs: 0, calories: 137 }, // 95% lean
        'steak': { protein: 25, fat: 19, carbs: 0, calories: 271 },
        'ribeye': { protein: 24, fat: 22, carbs: 0, calories: 290 },
        'sirloin': { protein: 29, fat: 10, carbs: 0, calories: 210 },
        'bacon': { protein: 37, fat: 42, carbs: 1, calories: 541, unit_g: 12 }, // ~540kcal/100g cooked
        'pork': { protein: 27, fat: 14, carbs: 0, calories: 242 },
        'pork chop': { protein: 30, fat: 12, carbs: 0, calories: 231 },
        'lamb': { protein: 25, fat: 21, carbs: 0, calories: 294 },
        'salmon': { protein: 20, fat: 13, carbs: 0, calories: 208 },
        'smoked salmon': { protein: 18, fat: 4, carbs: 0, calories: 117 },
        'tuna': { protein: 28, fat: 1, carbs: 0, calories: 132 }, // Canned in water
        'cod': { protein: 18, fat: 0.7, carbs: 0, calories: 82 },
        'tilapia': { protein: 26, fat: 2.7, carbs: 0, calories: 128 },
        'shrimp': { protein: 24, fat: 0.3, carbs: 0.2, calories: 99 },
        'tofu': { protein: 8, fat: 4.8, carbs: 1.9, calories: 76 },
        'tempeh': { protein: 20, fat: 11, carbs: 7.7, calories: 192 },
        'seitan': { protein: 75, fat: 1.9, carbs: 14, calories: 370 },
        'whey': { protein: 75, fat: 5, carbs: 9, calories: 375, unit_g: 32 }, // ~120kcal per 32g -> ~375/100g
        'protein powder': { protein: 75, fat: 5, carbs: 9, calories: 375, unit_g: 32 },
        'casein': { protein: 73, fat: 3, carbs: 10, calories: 360, unit_g: 32 },
        'yogurt': { protein: 10, fat: 0.4, carbs: 3.6, calories: 59, unit_g: 170 }, // Greek Non-Fat Cup (already per 100g data ok)
        'greek yogurt': { protein: 10, fat: 0.4, carbs: 3.6, calories: 59, unit_g: 170 },
        'cottage cheese': { protein: 11, fat: 4.3, carbs: 3.4, calories: 98, unit_g: 113 }, // 1/2 cup

        // --- CARBOHYDRATES ---
        'rice': { protein: 2.7, fat: 0.3, carbs: 28, calories: 130 }, // White Cooked
        'white rice': { protein: 2.7, fat: 0.3, carbs: 28, calories: 130 },
        'brown rice': { protein: 2.6, fat: 0.9, carbs: 23, calories: 111 },
        'basmati rice': { protein: 3.5, fat: 0.4, carbs: 25, calories: 120 },
        'jasmine rice': { protein: 2.4, fat: 0.2, carbs: 29, calories: 130 },
        'quinoa': { protein: 4.4, fat: 1.9, carbs: 21, calories: 120 }, // Cooked
        'couscous': { protein: 3.8, fat: 0.2, carbs: 23, calories: 112 },
        'oats': { protein: 13, fat: 6, carbs: 60, calories: 350 }, // Dry weight approx
        'oatmeal': { protein: 2.4, fat: 1.4, carbs: 12, calories: 71 }, // Cooked with water
        'bread': { protein: 9, fat: 3, carbs: 49, calories: 265, unit_g: 30 }, // ~80kcal/30g -> 265/100g
        'white bread': { protein: 9, fat: 3, carbs: 49, calories: 265, unit_g: 28 },
        'whole wheat bread': { protein: 13, fat: 4, carbs: 41, calories: 250, unit_g: 32 },
        'sourdough': { protein: 10, fat: 2, carbs: 50, calories: 270, unit_g: 35 },
        'bagel': { protein: 10, fat: 1.5, carbs: 55, calories: 275, unit_g: 105 }, // ~290/105g -> ~275
        'tortilla': { protein: 7, fat: 6, carbs: 50, calories: 300, unit_g: 40 }, // Flour
        'pasta': { protein: 5, fat: 1.1, carbs: 25, calories: 131 }, // Cooked
        'spaghetti': { protein: 5, fat: 1.1, carbs: 25, calories: 131 },
        'macaroni': { protein: 5, fat: 1.1, carbs: 25, calories: 131 },
        'noodles': { protein: 4, fat: 6, carbs: 25, calories: 138 }, // Instant
        'potato': { protein: 2, fat: 0.1, carbs: 17, calories: 77 },
        'sweet potato': { protein: 1.6, fat: 0.1, carbs: 20, calories: 86 },
        'corn': { protein: 3, fat: 1, carbs: 21, calories: 96 },

        // --- FATS ---
        'avocado': { protein: 2, fat: 15, carbs: 9, calories: 160, unit_g: 100 }, // ~half
        'oil': { protein: 0, fat: 100, carbs: 0, calories: 884, unit_g: 14 }, // 1 tbsp
        'olive oil': { protein: 0, fat: 100, carbs: 0, calories: 884, unit_g: 14 },
        'coconut oil': { protein: 0, fat: 100, carbs: 0, calories: 862, unit_g: 14 },
        'butter': { protein: 0.1, fat: 81, carbs: 0.1, calories: 717, unit_g: 14 }, // 1 tbsp
        'peanut butter': { protein: 8, fat: 16, carbs: 6, calories: 190, unit_g: 32 }, // 2 tbsp
        'almonds': { protein: 21, fat: 49, carbs: 22, calories: 575 },
        'walnuts': { protein: 15, fat: 65, carbs: 14, calories: 654 },
        'cashews': { protein: 18, fat: 44, carbs: 30, calories: 553 },
        'peanuts': { protein: 26, fat: 49, carbs: 16, calories: 567 },
        'avocado': { protein: 2, fat: 15, carbs: 9, calories: 160, unit_g: 150, fiber: 7, sat_fat: 2.1 }, // ~half
        'oil': { protein: 0, fat: 100, carbs: 0, calories: 884, unit_g: 14, fiber: 0, sat_fat: 14 }, // 1 tbsp
        'olive oil': { protein: 0, fat: 100, carbs: 0, calories: 884, unit_g: 15, fiber: 0, sat_fat: 14 },
        'coconut oil': { protein: 0, fat: 100, carbs: 0, calories: 862, unit_g: 14, fiber: 0, sat_fat: 87 },
        'butter': { protein: 0.9, fat: 81, carbs: 0.1, calories: 717, unit_g: 10, fiber: 0, sat_fat: 51 }, // 1 tbsp
        'peanut butter': { protein: 25, fat: 50, carbs: 20, calories: 588, unit_g: 32, fiber: 6, sat_fat: 10 }, // 2 tbsp
        'almonds': { protein: 21, fat: 49, carbs: 22, calories: 575, fiber: 12.2, sat_fat: 3.7 },
        'walnuts': { protein: 15, fat: 65, carbs: 14, calories: 654, fiber: 6.7, sat_fat: 6.1 },
        'cashews': { protein: 18, fat: 44, carbs: 30, calories: 553, fiber: 3.3, sat_fat: 7.8 },
        'peanuts': { protein: 26, fat: 49, carbs: 16, calories: 567, fiber: 8.5, sat_fat: 6.9 },
        'nuts': { protein: 21, fat: 49, carbs: 21, calories: 607, unit_g: 30, fiber: 7, sat_fat: 4 }, // Mixed nuts estimate
        'chia seeds': { protein: 17, fat: 31, carbs: 42, calories: 486, fiber: 34.4, sat_fat: 3.3 },
        'flax seeds': { protein: 18, fat: 42, carbs: 29, calories: 534, fiber: 27.3, sat_fat: 3.7 },
        'mayo': { protein: 0, fat: 10, carbs: 0, calories: 90, unit_g: 14, fiber: 0, sat_fat: 1.6 }, // 1 tbsp

        // --- FRUITS ---
        'banana': { protein: 1.1, fat: 0.3, carbs: 23, calories: 89, unit_g: 118, fiber: 2.6, sat_fat: 0.1 }, // Medium
        'apple': { protein: 0.3, fat: 0.2, carbs: 14, calories: 52, unit_g: 182, fiber: 2.4, sat_fat: 0 }, // Medium
        'orange': { protein: 0.9, fat: 0.1, carbs: 12, calories: 47, unit_g: 130, fiber: 2.4, sat_fat: 0 },
        'grapes': { protein: 0.7, fat: 0.2, carbs: 18, calories: 69, unit_g: 80, fiber: 0.9, sat_fat: 0.1 }, // Cup
        'strawberries': { protein: 0.7, fat: 0.3, carbs: 7.7, calories: 32, unit_g: 144, fiber: 2.0, sat_fat: 0.0 }, // Cup
        'blueberries': { protein: 0.7, fat: 0.3, carbs: 14, calories: 57, unit_g: 148, fiber: 2.4, sat_fat: 0.0 }, // Cup
        'raspberries': { protein: 1.2, fat: 0.7, carbs: 12, calories: 52, unit_g: 123, fiber: 6.5, sat_fat: 0.0 }, // Cup
        'melon': { protein: 0.8, fat: 0.2, carbs: 8, calories: 34, unit_g: 160, fiber: 0.9, sat_fat: 0.1 }, // Wedge
        'watermelon': { protein: 0.6, fat: 0.2, carbs: 8, calories: 30, unit_g: 280, fiber: 0.4, sat_fat: 0.0 }, // Wedge
        'pineapple': { protein: 0.5, fat: 0.1, carbs: 13, calories: 50, unit_g: 165, fiber: 1.4, sat_fat: 0.0 }, // Cup
        'mango': { protein: 0.8, fat: 0.4, carbs: 15, calories: 60, unit_g: 165, fiber: 1.6, sat_fat: 0.1 }, // Cup
        'kiwi': { protein: 1.1, fat: 0.5, carbs: 15, calories: 61, unit_g: 69, fiber: 3.0, sat_fat: 0.0 },
        'lemon': { protein: 1.1, fat: 0.3, carbs: 9, calories: 29, fiber: 2.8, sat_fat: 0.0 },

        // --- VEGETABLES ---
        'broccoli': { protein: 2.8, fat: 0.4, carbs: 7, calories: 34, fiber: 2.6, sat_fat: 0.0 },
        'spinach': { protein: 2.9, fat: 0.4, carbs: 3.6, calories: 23, fiber: 2.2, sat_fat: 0.0 },
        'lettuce': { protein: 1.4, fat: 0.2, carbs: 2.9, calories: 15, fiber: 1.3, sat_fat: 0.0 },
        'cucumber': { protein: 0.7, fat: 0.1, carbs: 3.6, calories: 15, fiber: 1.5, sat_fat: 0.0 },
        'tomato': { protein: 0.9, fat: 0.2, carbs: 3.9, calories: 18, fiber: 1.2, sat_fat: 0.0 },
        'onion': { protein: 1.1, fat: 0.1, carbs: 9, calories: 40, fiber: 1.7, sat_fat: 0.0 },
        'garlic': { protein: 6.4, fat: 0.5, carbs: 33, calories: 149, unit_g: 3, fiber: 2.1, sat_fat: 0.1 }, // 1 clove
        'carrot': { protein: 0.9, fat: 0.2, carbs: 10, calories: 41, fiber: 2.8, sat_fat: 0.0 },
        'peppers': { protein: 1, fat: 0.3, carbs: 6, calories: 31, fiber: 1.7, sat_fat: 0.1 },
        'asparagus': { protein: 2.2, fat: 0.1, carbs: 3.9, calories: 20, fiber: 2.1, sat_fat: 0.0 },
        'green beans': { protein: 1.8, fat: 0.1, carbs: 7, calories: 31, fiber: 3.4, sat_fat: 0.0 },
        'mushrooms': { protein: 3.1, fat: 0.3, carbs: 3.3, calories: 22, fiber: 1.0, sat_fat: 0.0 },
        'zucchini': { protein: 1.2, fat: 0.3, carbs: 3.1, calories: 17, fiber: 1.1, sat_fat: 0.1 },

        // --- DAIRY / LIQUIDS ---
        'milk': { protein: 3.4, fat: 3.6, carbs: 4.8, calories: 61, unit_g: 250, fiber: 0, sat_fat: 2.3 }, // Cup/Glass
        'whole milk': { protein: 3.4, fat: 3.6, carbs: 4.8, calories: 61, unit_g: 250, fiber: 0, sat_fat: 2.3 },
        'skim milk': { protein: 3.4, fat: 0.2, carbs: 4.8, calories: 35, unit_g: 250, fiber: 0, sat_fat: 0.1 },
        'almond milk': { protein: 0.4, fat: 1.1, carbs: 0.6, calories: 13, unit_g: 250, fiber: 0.5, sat_fat: 0 }, // Unsweetened
        'oat milk': { protein: 0.5, fat: 1.5, carbs: 6.5, calories: 42, unit_g: 250, fiber: 0.5, sat_fat: 0.2 },
        'soy milk': { protein: 3.3, fat: 1.8, carbs: 6, calories: 54, unit_g: 250, fiber: 0.6, sat_fat: 0.3 },
        'cream': { protein: 2.7, fat: 19, carbs: 3.7, calories: 195, unit_g: 15, fiber: 0, sat_fat: 12.0 }, // 1 tbsp
        'half and half': { protein: 3, fat: 11, carbs: 4, calories: 130, unit_g: 15, fiber: 0, sat_fat: 7.0 },
        'cheese': { protein: 25, fat: 33, carbs: 1.3, calories: 402, unit_g: 28, fiber: 0, sat_fat: 19.0 }, // Cheddar slice
        'cheddar': { protein: 25, fat: 33, carbs: 1.3, calories: 402, unit_g: 28, fiber: 0, sat_fat: 19.0 },
        'mozzarella': { protein: 22, fat: 22, carbs: 2.2, calories: 300, unit_g: 28, fiber: 0, sat_fat: 13.0 },
        'parmesan': { protein: 38, fat: 29, carbs: 4, calories: 431, unit_g: 5, fiber: 0, sat_fat: 19.0 }, // 1 tsp

        // --- JUNK / CONVENIENCE ---
        'coke': { protein: 0, fat: 0, carbs: 10.6, calories: 42, unit_g: 330 }, // Can 330ml
        'diet coke': { protein: 0, fat: 0, carbs: 0, calories: 1, unit_g: 330 }, // Can 330ml
        'coke zero': { protein: 0, fat: 0, carbs: 0, calories: 1, unit_g: 330 }, // Can 330ml
        'beer': { protein: 0.5, fat: 0, carbs: 3.6, calories: 43, unit_g: 330 }, // Bottle/Can 330ml
        'wine': { protein: 0.1, fat: 0, carbs: 2.6, calories: 83, unit_g: 150 }, // Glass
        'vodka': { protein: 0, fat: 0, carbs: 0, calories: 231, unit_g: 30 }, // Shot
    },

    /**
     * Parse simple quantity from string if using offline mode
     * Supports: "300g chicken", "2 eggs", "1 banana"
     * @param {string} query
     * @param {number} manualAmount (Optional) Override quantity in grams/ml
     */
    parseOfflineQuery: function (query, manualAmount = null) {
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

        // 2. Determine Amount
        let amount = 0;

        if (manualAmount && manualAmount > 0) {
            // Manual Override takes precedence
            amount = parseFloat(manualAmount);
        } else {
            // Parse from string or Default
            const numberMatch = lower.match(/((\d+(\.\d+)?))/); // Matches int or float
            const rawNumber = numberMatch ? parseFloat(numberMatch[0]) : null;

            // Determine Unit Type (Weight vs Count)
            // Fix: 'g' check was matching 'eggs', 'bagel' etc. Use Regex for explicit units.
            // Matches: 100g, 100 g, 100gram, 100ml, 100 ml
            const weightUnitRegex = /(\d+)\s*(g|gram|ml|oz|lb)/i;
            const isGram = weightUnitRegex.test(lower);

            const isUnit = !isGram && match.unit_g; // If no explicit weight unit found and DB has unit_g, assume count

            if (rawNumber !== null) {
                if (isUnit) {
                    // "2 eggs" -> 2 * unit_g -> 100g
                    amount = rawNumber * match.unit_g;
                } else {
                    // "300 chicken" -> assume 300g default if just number
                    // "500g eggs" -> 500
                    amount = rawNumber;
                }
            } else {
                // No number found ("egg", "chicken")
                if (match.unit_g) amount = match.unit_g; // 1 unit
                else amount = 100; // Default 100g
            }
        }

        // 3. Calculate stats
        const factor = amount / 100; // Database is per 100g

        return {
            name: matchName + ` (${amount}g)`,
            calories: typeof match.calories === 'number' ? Math.round(match.calories * factor) : 0,
            protein: typeof match.protein === 'number' ? Math.round(match.protein * factor) : 0,
            fat: typeof match.fat === 'number' ? Math.round(match.fat * factor) : 0,
            carbs: typeof match.carbs === 'number' ? Math.round(match.carbs * factor) : 0,
            fiber: typeof match.fiber === 'number' ? Math.round(match.fiber * factor) : 0,
            sat_fat: typeof match.sat_fat === 'number' ? Math.round(match.sat_fat * factor) : 0,
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
     * @param {number} manualAmount Optional manual quantity override
     */
    fetchNutrition: async function (query, manualAmount = null) {
        if (!query) return [];

        try {
            // If manual amount is provided, preprocess query to include it for better API understanding
            // But API might be confused if query is "Coke" and we send "100g Coke" if user meant count.
            // For now, let's rely on offline for overrides as API handling is complex without NLP.
            // OR: We try offline FIRST if manualAmount is present? 
            // Let's stick to the existing flow but pass manualAmount to offline fallback.

            // Actually, for API, if user types "Coke" and manualAmount is 330, we should probably send "330ml Coke".
            let apiQuery = query;
            if (manualAmount) {
                apiQuery = `${manualAmount}g ${query}`; // Simplified assumption (g/ml)
            }

            console.log(`Fetching nutrition for: ${apiQuery} via Netlify Function`);
            const url = `/.netlify/functions/get-nutrition?query=${encodeURIComponent(apiQuery)}`;

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
            const rawItems = JSON.parse(jsonStr);

            // Standardize fields to internal format
            const items = rawItems.map(item => ({
                name: item.name,
                calories: Math.round(item.calories || 0),
                protein: item.protein_g || item.protein || 0,
                carbs: item.carbohydrates_total_g || item.carbs || 0,
                fat: item.fat_total_g || item.fat || 0,
                fiber: item.fiber_g || item.fiber || 0,
                sat_fat: item.saturated_fat_g || item.sat_fat || 0,
                serving_size_g: item.serving_size_g || 100,
                source: 'GEMINI_API'
            }));

            return items;

        } catch (error) {
            console.warn("Netlify Service failed, falling back to offline.", error);
            // Only fallback to offline for simple queries, complex natural language won't match well
            if (query.split(' ').length < 4) {
                const local = this.parseOfflineQuery(query, manualAmount);
                if (local) return [local];
            }
            return [];
        }
    }
};
