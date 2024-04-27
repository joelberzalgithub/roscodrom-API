const io = require('socket.io-client');

console.log('starting client...');
const socket = io('http://127.0.0.1:3000');

socket.on('connect', () => {
    console.log('Connected to the server');
    socket.emit('join', 'hello');
});

socket.on('message', (data) => {
    console.log(data);
});