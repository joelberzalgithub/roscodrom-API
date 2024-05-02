const logger = require('../logger');
const { authenticateUser } = require('../utils/userUtils');

const handleJoin = async (socket, data, rooms, logger, Room, generateUUID, protocols) => {
    logger.info(`Received join message from socket ${socket.id}`);
    const { nickname, apiKey } = JSON.parse(data);

    let user = await authenticateUser(nickname, apiKey);
    if (user !== null) {
        logger.info(`User with nickname ${user.nickname} has been validated.`);
        user.socket = socket;
    }

    let validRoom = null;
    rooms.forEach(room => {
        if (room.match !== null && !room.match.matchStarted) {
            validRoom = room;
        }
    });

    if (validRoom === null) {
        logger.warn('No rooms available, creating new one...');
        validRoom = new Room(generateUUID(), rooms);
        rooms.set(validRoom.id, validRoom);
    }

    const success = validRoom.addUser(user);
    if (success) {
        const roomId = validRoom.id;
        logger.info(`Assigned player with nickname ${nickname} to room ${validRoom.id}`);
        return roomId;
    } else {
        logger.error(`Something went wrong while adding user with nickname ${nickname} to the room`);
        return null;
    }
};

const handleWord = async (socket, data, wordUtils) => {
    const { word } = JSON.parse(data);

    let score = 0;
    const exists = await wordUtils.wordExists(word, 'catalan');
    if (exists) {
        score = await wordUtils.evaluateWord(word, 'catalan');
    }

    socket.emit('score', JSON.stringify({
        score: score
    }));
};

const handleDisconnect = async (socket, user, roomId, rooms, logger) => {
    if (user !== null) {
        if (roomId !== null) {
            if (rooms.has(roomId)) {
                const room = rooms.get(roomId);
                const removed = room.removeUser(user);
                if (removed) logger.info(`Removed user with nickname ${user.nickname} from room ${room.id}`);
            } else {
                roomId = null;
            }
        }
        logger.info(`User with nickname ${user.nickname} has disconnected.`);
    } else {
        logger.info(`Unidentified socket with id ${socket.id} has disconnected`);
    }
};

module.exports = {
    handleJoin,
    handleWord,
    handleDisconnect
};