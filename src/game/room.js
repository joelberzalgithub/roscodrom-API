const logger = require('../logger');

class Room {
    constructor(uuid) {
        this.uuid = uuid;
        this.players = new Map();
        this.timerDuration = 10000;
        this.timer = null;
        this.isTimerActive = false;
    }

    addPlayer(player) {
        this.players.set(player.uuid, player.nickname);
        if (!this.isTimerActive && this.players.size === 1) {
            this.startTimer();
        }
    }

    removePlayer(player) {
        this.players.delete(player.uuid);
        if (this.players.size === 0) {
            this.stopTimer();
        }
    }

    getPlayers() {
        return [...this.players.values()];
    }

    startTimer() {
        this.isTimerActive = true;
        let secondsLeft = this.timerDuration / 1000;

        this.timer = setInterval(async () => {
            if (secondsLeft > 0) {
                logger.info(`Seconds left for game start: ${secondsLeft}`);
                secondsLeft--;
            } else {
                clearInterval(this.timer);
                this.isTimerActive = false;
                logger.info(`The game is starting!`);
            }
        }, 1000);
    }

    stopTimer() {
        clearTimeout(this.timer);
        this.isTimerActive = false;
    }

    isRoomFull() {
        return this.players.size >= 10;
    }
}

module.exports = Room;