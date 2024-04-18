const { v4: uuidv4 } = require('uuid');
const express = express();
const util = express.Router();

function generateUUID() {
    return uuidv4();
}

module.exports = util;