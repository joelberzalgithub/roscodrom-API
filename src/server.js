const { Server } = require('socket.io');
const Room = require('./game/room');
const http = require('http');
const app = require('./app');
const logger = require('./logger');
const protocols = require('./game/messageProtocol');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    logger.info(`HTTP Server listening on port ${port}`);
});


const io = new Server(server);
io.on('connection', socket => {
    let user = null;
    
    socket.on('join', (nickname, apiKey) => {
        user = protocols.handleJoinMessage(nickname, apiKey);
        if (user !== null) {
            logger.info(`User with nickname ${user.nickname} has joined.`);
        }
    });

});

