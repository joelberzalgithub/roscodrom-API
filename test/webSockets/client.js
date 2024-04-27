const io = require('socket.io-client');

console.log('starting client...');
const socket = io('http://127.0.0.1:3000');

socket.on('connect', () => {
    console.log('Connected to the server');
    socket.emit('join', 'alex');
});

socket.on('join', (data) => {
    console.log(data);
});

socket.on('start', (data) => {
    console.log(data);
});