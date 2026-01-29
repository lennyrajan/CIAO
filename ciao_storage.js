// CIAO Storage: Persistence Layer

window.CIAO = window.CIAO || {};

window.CIAO.Storage = {
    KEY_HISTORY: 'ciao_history_v1',
    KEY_USER: 'ciao_user_v1',
    KEY_LOGS: 'ciao_logs_v1',

    getUser: function () {
        try {
            return JSON.parse(localStorage.getItem(this.KEY_USER));
        } catch (e) { return null; }
    },

    saveUser: function (userProfile) {
        localStorage.setItem(this.KEY_USER, JSON.stringify(userProfile));
    },

    getTodayLog: function () {
        const today = new Date().toISOString().split('T')[0];
        try {
            const logs = JSON.parse(localStorage.getItem(this.KEY_LOGS)) || {};
            return logs[today] || null;
        } catch (e) { return null; }
    },

    saveTodayLog: function (logData) {
        const today = new Date().toISOString().split('T')[0];
        const logs = JSON.parse(localStorage.getItem(this.KEY_LOGS)) || {};
        logs[today] = logData;
        localStorage.setItem(this.KEY_LOGS, JSON.stringify(logs));
    },

    getHistory: function () {
        try {
            return JSON.parse(localStorage.getItem(this.KEY_HISTORY)) || [];
        } catch (e) { return []; }
    },

    saveHistory: function (entry) {
        const history = this.getHistory();
        // Check if entry for this date exists, update if necessary or append
        const existsIndex = history.findIndex(h => h.date === entry.date);
        if (existsIndex >= 0) {
            history[existsIndex] = entry;
        } else {
            history.push(entry);
        }
        // Sort by date newly -> oldest
        history.sort((a, b) => new Date(b.date) - new Date(a.date));

        localStorage.setItem(this.KEY_HISTORY, JSON.stringify(history));
    },

    clearTodayLog: function () {
        const today = new Date().toISOString().split('T')[0];
        const logs = JSON.parse(localStorage.getItem(this.KEY_LOGS)) || {};
        if (logs[today]) {
            delete logs[today];
            localStorage.setItem(this.KEY_LOGS, JSON.stringify(logs));
        }
    },

    clearUser: function () {
        localStorage.removeItem(this.KEY_USER);
    },

    clearAll: function () {
        localStorage.removeItem(this.KEY_USER);
        localStorage.removeItem(this.KEY_LOGS);
        localStorage.removeItem(this.KEY_HISTORY);
        // Also clear visitor count for true factory reset
        localStorage.removeItem('ciao_visitor_count');
    }
};
