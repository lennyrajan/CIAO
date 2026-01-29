// CIAO Engine: TDEE and BMR Calculations

window.CIAO = window.CIAO || {};

window.CIAO.Engine = {
    /**
     * Calculate Mifflin-St Jeor BMR
     * @param {number} weightKg 
     * @param {number} heightCm 
     * @param {number} ageYears 
     * @param {string} gender 'male' | 'female'
     */
    calculateBMR: function (weightKg, heightCm, ageYears, gender) {
        // Mifflin-St Jeor Equation
        let s = (gender === 'male' || gender === 'm') ? 5 : -161;
        return (10 * weightKg) + (6.25 * heightCm) + (5 * ageYears) + s;
    },

    calculateActivityBurn: function (weightKg, type, durationMinutes, intensity = 'moderate') {
        // MET Values (Metabolic Equivalent of Task)
        const METS = {
            'steps': 0, // Handled separately
            'walk': 3.5,
            'run': 8.0, // Avg 5mph
            'cycle': 7.5, // Avg moderate
            'lift': 4.5, // Resistance training
            'sport': 7.0, // General competitive
            'hiit': 8.0,
            'custom': 0
        };

        // Intensity Modifiers (Simple multiplier if needed, or specific overrides)
        // For now, we use base METs. Smart logic can infer intensity from distance if provided later.

        let met = METS[type] || 3.0; // Default to light activity if unknown

        // Formula: Calories = MET * Weight(kg) * Duration(hours)
        const durationHours = durationMinutes / 60;
        return Math.round(met * weightKg * durationHours);
    },

    /**
     * Calculate Lean Body Mass based BMR (Katch-McArdle) - Optional alternative
     */
    calculateBMR_LBM: function (lbmKg) {
        return 370 + (21.6 * lbmKg);
    },

    /**
     * Calculate Daily Limit based on activity
     * @param {number} bmr 
     * @param {number} steps 
     * @param {number} workoutCalories 
     */
    calculateDynamicTDEE: function (bmr, steps, workoutCalories = 0) {
        // Base Sedentary Multiplier logic
        // "Sedentary" is usually BMR * 1.2
        // But CIAO separates this: Base = BMR. Activity adds on top.
        // Let's assume User usually burns BMR * 1.2 just existing.
        // So Base Floor = BMR * 1.2

        const safeBmr = parseFloat(bmr) || 2000;
        const safeSteps = parseFloat(steps) || 0;
        const safeWork = parseFloat(workoutCalories) || 0;

        const sedentaryFloor = safeBmr * 1.2;

        // Step Calories: approx 0.04 kcal per step (very rough, usually 40 per 1000)
        // Let's use 40 kcal per 1000 steps
        const stepBurn = (safeSteps / 1000) * 40;

        return Math.round(sedentaryFloor + stepBurn + safeWork);
    },

    /**
     * Get Progress Status
     */
    getMissionStatus: function (intake, limit) {
        if (intake > limit) return { status: 'OVER LIMIT', color: 'red' };
        if (limit - intake < 200) return { status: 'ON TARGET', color: 'green' };
        return { status: 'UNDER LIMIT', color: 'blue' };
    },

    /**
     * Adjust TDEE based on Mission Goal
     * @param {number} tdee Total Daily Energy Expenditure
     * @param {string} goal 'maintenance' | 'cut' | 'bulk'
     */
    adjustToGoal: function (tdee, goal) {
        switch (goal) {
            case 'cut': return Math.round(tdee - 500); // Deficit
            case 'bulk': return Math.round(tdee + 300); // Surplus
            case 'maintenance':
            default:
                return tdee;
        }
    }
};
