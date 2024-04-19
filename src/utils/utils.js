const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

function generateUUID() {
    return uuidv4();
}

function generateApiKey() {
    const keyLength = 64;
    return crypto.randomBytes(Math.ceil(keyLength / 2)).toString('hex').slice(0, keyLength);
}

function buildResponse(code, message, data) {
    return {
        statusCode: code,
        message: message,
        data: data
    }
}

module.exports = {
    generateUUID:generateUUID,
    generateApiKey:generateApiKey,
    buildResponse:buildResponse
}