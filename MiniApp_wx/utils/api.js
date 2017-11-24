var config = require('./config.js');

module.exports = {
    getUrl(route) {
        return `https://${config.baseUrl}${route}`;
    },
};