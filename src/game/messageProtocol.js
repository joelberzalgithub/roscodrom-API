const logger = require('../logger');
const { authenticateUser } = require('../utils/userUtils');

async function handleJoinMessage(nickname, apiKey) {
    const user = await authenticateUser(nickname, apiKey);
    return user;
}

module.exports = {
    handleJoinMessage
}