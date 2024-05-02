const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ level, message, timestamp }) => {
        let levelColor, timestampColor, messageColor;
        switch (level) {
          case 'info':
            levelColor = '\x1b[96m'; // Bright Cyan
            break;
          case 'warn':
            levelColor = '\x1b[93m'; // Bright Yellow
            break;
          case 'error':
            levelColor = '\x1b[91m'; // Bright Red
            break;
          case 'debug':
            levelColor = '\x1b[32m'; // Bright Green
            break;
          default:
            levelColor = '\x1b[97m'; // Bright White
        }
        timestampColor = '\x1b[95m'; // Bright Purple
        return `${timestampColor}[${timestamp}] ${levelColor}[${level.toUpperCase()}]: ${message}\x1b[0m`;
      })
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: './logs/combined.log' }),
      new winston.transports.Console(),
    ],
});

module.exports = logger;
