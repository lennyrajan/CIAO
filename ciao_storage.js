// CIAO Storage: Persistence Layer

window.CIAO = window.CIAO || {};

window.CIAO.Storage = {
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
    }
};
