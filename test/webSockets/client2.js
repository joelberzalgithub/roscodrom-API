const io = require('socket.io-client');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('starting client...');
const socket = io('http://127.0.0.1:3000');

socket.on('connect', () => {
    displayMenu();
    console.log('Connected to the server');
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
});


socket.on('matchStart', (data) => {
    console.log(data);
});

socket.on('score', (data) => {
    console.log(data);
})

socket.on('start', (data) => {
    console.log(data);
});

socket.on('kicked', (data) => {
    console.log(data);
});




async function displayMenu() {

    console.log('1) Join room');
    console.log('2) Send word');

    rl.question("Enter your choice: ", (choice) => {
        switch (choice.trim()) {
            case '1':
                socket.emit('join', JSON.stringify(
                    {
                        nickname: 'joel',
                        apiKey: 'a40eb6e51a163bd05267124753267e9abd903461f0482cedf8589af0b547a802'
                    }
                ));
                displayMenu();
                break;
            case '2':
                rl.question('Word: ', (word) => {
                    socket.emit('word', JSON.stringify({
                        word: word
                    }));
                    displayMenu();
                });
                displayMenu();
                break;
            default:
                displayMenu();
            }
        });   
}