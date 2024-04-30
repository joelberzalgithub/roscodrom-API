const logger = require('../../logger');

class Match {
    constructor(room) {
        this.room = room;
        this.startCountdown = null;
        this.matchTimer = null;
        this.matchStarted = false;
        this.countdownTime = 20000;
        this.letters = [];
        this.scores = new Map();
    }

    async start() {
        this.startMatchCountdown();
    }

    startMatchCountdown() {
        logger.info(`Room ${this.room.id} match starting in ${this.countdownTime} ms.`);
        let millisLeft = this.countdownTime;
        this.startCountdown = setInterval(async () => {
            if (millisLeft >= 0) {
                this.room.broadcast('startTime', JSON.stringify({
                    millisLeft: millisLeft
                }));
                millisLeft = millisLeft - 1000;
            } else {
                clearInterval(this.startCountdown);
                await this.room.users.forEach(user => {
                    this.scores.set(user.nickname, 0);
                });
                this.room.broadcast('matchStart', JSON.stringify({
                    message: 'The match has started!'
                }));
                this.matchStarted = true;
                this.startMatchTimer();
            }
        }, 1000);
    }

    startMatchTimer() {
        logger.info(`Room ${this.room.id} match has started`);
        let millisLeft = 20000;
        this.matchTimer = setInterval(async () => {
            if (millisLeft > 0) {
                this.room.broadcast('timeLeft', JSON.stringify({
                    millistLeft: millisLeft
                }));
                millisLeft = millisLeft - 1000;
            } else if (millisLeft == 0) {
                logger.info(`Room ${this.room.id} match has ended`);
                clearInterval(this.matchTimer);
                this.broadcashScores();
                this.room.removeAllUsers();
                this.matchStarted = false;
            }
        }, 1000);
    }

    broadcashScores() {
        this.room.broadcast('matchScores', JSON.stringify({
            scores: JSON.stringify(Array.from(this.scores))
        }));
    }
}

module.exports = Match;