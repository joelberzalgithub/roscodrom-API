const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

function generateUUID() {
    return uuidv4();
}

function generateApiKey() {
    const keyLength = 64;
    return crypto.randomBytes(Math.ceil(keyLength / 2)).toString('hex').slice(0, keyLength);
}

function buildResponse(code, message, data = {}) {
    return {
        statusCode: code,
        message: message,
        data: data
    }
}

function getISOTimestampWithMilliseconds() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

module.exports = {
    generateUUID:generateUUID,
    generateApiKey:generateApiKey,
    buildResponse:buildResponse,
    getISOTimestampWithMilliseconds
}