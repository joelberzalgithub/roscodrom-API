const winston = require('winston');

const logger = winston.createLogger({
    transports: [ new winston.transports.Console() ],
    format: winston.format.cli(),
    level: 'info',
});

module.exports = logger;