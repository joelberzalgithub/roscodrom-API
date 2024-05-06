const logger = require('../logger');
const {authenticateUser} = require('../utils/userUtils');

const handleJoin = async (socket, data, rooms, logger, Room, generateUUID) => {
    logger.info(`Received join message from socket ${socket.id}`);
    const {nickname, apiKey} = JSON.parse(data);
    let roomId = null;

    let user = await authenticateUser(nickname, apiKey);
    if (user !== null) {
        logger.info(`User with nickname ${user.nickname} has been validated.`);
        user.socket = socket;

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
            roomId = validRoom.id;
            logger.info(`Assigned player with nickname ${nickname} to room ${validRoom.id}`);
            socket.emit('Join', JSON.stringify({
                success: true,
                message: 'Success.'
            }));

        } else {
            logger.error(`Something went wrong while adding user with nickname ${nickname} to the room`);
        }

    } else {
        logger.warn(`Unable to authenticate socket ${socket.id}. Forcing disconnection.`);
        socket.emit('Join', JSON.stringify({
            success: false,
            message: 'Unable to authenticate with given credentials. Disconnection forced'
        }));
        socket.disconnect();
    }

    return roomId;
};

const handleWord = async (socket, data, wordUtils, rooms, roomId, user) => {
    const {word} = JSON.parse(data);
    let score = 0;

    if (rooms !== null && rooms.has(roomId)) {
        const room = rooms.get(roomId);
        if (room.match.matchStarted) {
            const exists = await wordUtils.wordExists(word, 'catalan');
            const isFound = await room.match.isWordFound(word);
            if (exists && !isFound) {
                score = await wordUtils.evaluateWord(word, 'catalan', room.match.letters);
                await room.match.updateMatchWords(word, score, user);
            }
            socket.emit('score', JSON.stringify({
                score: score
            }));
        } else {
            logger.warn(`Received word message but the assigned room match has not started.`)
        }
    }
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