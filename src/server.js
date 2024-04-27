const { Server } = require('socket.io');
const Room = require('./game/room');
const http = require('http');
const app = require('./app');
const logger = require('./logger');
const { generateUUID } = require('./utils/utils');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    logger.info(`HTTP Server listening on port ${port}`);
});

const io = new Server(server);
const rooms = [];

io.on('connection', (socket) => {
    logger.info(`WebSocket client connected with id: ${socket.id}`);

    socket.on('join', (nickname) => {
        let room = rooms.find(room => rooms.players.size <= 10);
        
        if (!room) {
            logger.info('No existing room found, creating new one.');
            const roomUUID = generateUUID();
            room = new Room(roomUUID);
        }

        room.addPlayer(nickname);
        logger.info(`User ${nickname} joined room with ID: ${room.uuid}`);
        socket.send({roomUUID: room.uuid});
    });
});
