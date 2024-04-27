const { Server } = require('socket.io');
const Room = require('./game/room');
const http = require('http');
const app = require('./app');
const logger = require('./logger');

const port = process.env.PORT || 3000;

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server
const io = new Server(server);

// Listen for WebSocket connections
io.on('connection', (socket) => {
    logger.info('WebSocket client connected');
});