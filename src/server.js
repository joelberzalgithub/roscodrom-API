const { Server } = require('socket.io');
const http = require('http');
const app = require('./app');
const logger = require('./logger');
const protocols = require('./game/messageProtocol');
const Room = require('./game/classes/room');
const { generateUUID } = require('./utils/utils');
const wordUtils = require('./utils/wordUtils');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    logger.info(`HTTP Server listening on port ${port}`);
});


const io = new Server(server);
const rooms = new Map();
io.on('connection', socket => {
    let user = null;
    let roomId = null;
    
    socket.on('join', async (message) => {
        logger.info(`Received join message from socket ${socket.id}`);
        const data = JSON.parse(message);
        const nickname = data.nickname;
        const apiKey = data.apiKey;

        user = await protocols.handleJoinMessage(nickname, apiKey);
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
            roomId = validRoom.id;
            logger.info(`Assigned player with nickname ${nickname} to room ${validRoom.id}`);
        } else {
            logger.error(`Something went wrong while adding user with nickname ${nickname} to the room`);
        }

    });

    socket.on('word', async (message) => {
        const data = JSON.parse(message);
        const word = data.word; 

        let score = 0;
        const exists = await wordUtils.wordExists(word, 'catalan');
        if (exists) {
            score = await wordUtils.evaluateWord(word, 'catalan');
        }

        socket.emit('score', JSON.stringify({
            score: score
        }));
        
    });

    socket.on('disconnect', async () => {
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

    });

});

