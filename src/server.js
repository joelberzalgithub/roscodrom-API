const { Server } = require('socket.io');
const Room = require('./game/room');
const http = require('http');
const app = require('./app');
const logger = require('./logger');
const { generateUUID } = require('./utils/utils');
const { findUserByNickname } = require('./utils/userUtils');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    logger.info(`HTTP Server listening on port ${port}`);
});

const io = new Server(server);
const rooms = [];

// Will change join param from nickname to apiKey.
io.on('connection', (socket) => {
    logger.info(`WebSocket client connected with id: ${socket.id}`);

    socket.on('join', async (nickname) => {
        let room = rooms.find(room => rooms.players.size <= 10);
        const user = await findUserByNickname(nickname);
        if (user === null) {
            socket.emit('join', {
                success: false,
                roomUUID: undefined
            });
            return;
        }

        if (!room) {
            logger.info('No existing room found, creating new one.');
            const roomUUID = generateUUID();
            room = new Room(roomUUID);
        }

        user.socket = socket;
        room.addPlayer(user);
        logger.info(`User ${nickname} joined room with ID: ${room.uuid}`);
        socket.emit('join', {
            success: true,
            roomUUID: room.uuid
        });
    });
});
