const app = require('./app');
const logger = require('./logger');


const port = process.env.PORT || 80;
app.listen(port, () =>  logger.info(`Listening port ${port}...`));