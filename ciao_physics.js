// CIAO Physics: Food Interactions

window.CIAO = window.CIAO || {};

window.CIAO.Physics = {
    /**
     * Apply modifiers to a food item
     * @param {object} foodItem { protein, carbs, fat, calories }
     * @param {object} options { isAirFried: boolean, bonePercent: number (0-1), yieldPercent: number (0-1) }
     */
    applyPhysics: function (foodItem, options) {
        let result = { ...foodItem };

        // Yield / Bone (Reduces quantity essentially)
        // If we have "Gross Weight" and yield factors, we reduce the effective macros.
        // Assuming foodItem macros are for the "Gross" amount input.

        let multiplier = 1.0;

        if (options.yieldPercent) {
            multiplier *= options.yieldPercent;
        }
        if (options.bonePercent) {
            multiplier *= (1 - options.bonePercent);
        }

        // Apply mass reduction to all headers
        result.protein *= multiplier;
        result.carbs *= multiplier;
        result.fat *= multiplier;
        result.calories *= multiplier;

        // Air Fryer (Specific Fat Reduction)
        if (options.isAirFried) {
            // Reduces fat by 15% (factor 0.85)
            // 1g Fat = 9 cal.
            const originalFat = result.fat;
            const newFat = originalFat * 0.85;
            const fatLoss = originalFat - newFat;

            result.fat = newFat;
            result.calories -= (fatLoss * 9);
        }

        // Rounding
        result.protein = Math.round(result.protein * 10) / 10;
        result.carbs = Math.round(result.carbs * 10) / 10;
        result.fat = Math.round(result.fat * 10) / 10;
        result.calories = Math.round(result.calories);

        return result;
    }
};
