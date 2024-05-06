const { Server } = require('socket.io');
const http = require('http');
const app = require('./app');
const logger = require('./logger');
const protocols = require('./game/messageProtocol');
const Room = require('./game/classes/room');
const { generateUUID } = require('./utils/utils');
const wordUtils = require('./utils/wordUtils');

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
    logger.info('Received kill signal, shutting down gracefully');
    server.close();
    process.exit(1);
}


const port = process.env.PORT || 3000;
const server = http.createServer(app);
const { handleJoin, handleWord, handleDisconnect } = require('./game/messageProtocol');


server.listen(port, () => {
    logger.info(`HTTP Server listening on port ${port}`);
});


const io = new Server(server);
const rooms = new Map();
io.on('connection', socket => {
    let user = null;
    let roomId = null;

    socket.on('join', async (message) => {
        roomId = await handleJoin(socket, message, rooms, logger, Room, generateUUID, user);
        if (roomId !== null) {
            user = rooms.get(roomId).getUserBySocket(socket);
        }
    });

    socket.on('word', async (message) => {
        await handleWord(socket, message, wordUtils, rooms, roomId, user);
    });

    socket.on('disconnect', async () => {
        await handleDisconnect(socket, user, roomId, rooms, logger);
    });
});

