const io = require('socket.io-client');

console.log('starting client...');
const socket = io('http://127.0.0.1:3000');

socket.on('connect', () => {
    console.log('Connected to the server');
    const data = JSON.stringify({
        nickname: 'alex',
        apiKey: 'de55c8bc3dabf8ecdc4e382ddc422301556ce3f91eec60c55feb53e58147b33b'
    });
    socket.emit('join', data);
});

socket.on('join', (data) => {
    console.log(data);
});

socket.on('startTime', (data) => {
    console.log(data);
})

socket.on('timeLeft', (data) => {
    console.log(data);
})

socket.on('matchScores', (data) => {
    console.log(data);
})

socket.on('start', (data) => {
    console.log(data);
});