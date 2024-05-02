const logger = require('../../logger');

class Match {
    /**
     * Represents a match instance.
     * @param {object} room - The room where the match takes place.
     * @param {number} initialCountdownTime - The initial countdown time before the match starts.
     * @param {number} totalMatchDuration - The total duration of the match.
     */
    constructor(room, initialCountdownTime, totalMatchDuration) {
        this.room = room;
        this.initiateCountdown = null;
        this.initiateTimer = null;
        this.matchStarted = false;
        this.initialCountdownTime =  initialCountdownTime;
        this.totalMatchDuration = totalMatchDuration
        this.letters = [];
        this.scores = new Map();
    }

    /**
     * Starts the match.
     */
    async start() {
        this.initiateMatchCountdown();
    }

    /**
     * Initiates the countdown before the match starts.
     */
    initiateMatchCountdown() {
        logger.info(`Room ${this.room.id} match starting in ${this.initialCountdownTime} ms.`);
        let millis = this.initialCountdownTime;
    
        this.initiateCountdown = setInterval(() => {
            this.updateCountdown(millis);
            millis -= 1000;
        }, 1000);
    }

    /**
     * Initiates the timer for the match.
     */
    initiateMatchTimer() {
        logger.info(`Room ${this.room.id} match has started`);
        let millis = this.totalMatchDuration;

        this.initiateTimer = setInterval(() => {
            this.updateMatchTimer(millis);
            millis -= 1000;
        }, 1000);
    }

    /**
     * Updates the countdown during the match initialization.
     * @param {number} millis - The remaining time in milliseconds.
     */
    async updateCountdown(millis) {
        let remainingMillis = millis;
        if (remainingMillis >= 0) {
            this.room.broadcast('startTime', JSON.stringify({
                millisLeft: remainingMillis
            }));
        } 
        
        else {
            clearInterval(this.initiateCountdown);
            await this.room.users.forEach(user => this.scores.set(user.nickname, 0));
            
            this.matchStarted = true;
            this.room.broadcast('matchStart', JSON.stringify({message: 'The match has started!'}));
            this.initiateMatchTimer();
        }
    }

    /**
     * Updates the match timer during the match.
     * @param {number} millis - The remaining time in milliseconds.
     */
    async updateMatchTimer(millis) {
        let remainingMillis = millis;
        if (remainingMillis > 0) {
            this.room.broadcast('timeLeft', JSON.stringify({millistLeft: remainingMillis}));

        } 
        
        else if (remainingMillis == 0) {
            logger.info(`Room ${this.room.id} match has ended`);
            clearInterval(this.initiateTimer);

            this.broadcastScores();
            this.room.removeAllUsers();
        }
    }

    /**
     * Broadcasts the match scores to all users.
     */
    broadcastScores() {
        this.room.broadcast('matchScores', this.calculateRanking());
    }

    /**
     * Calculates the ranking based on the match scores.
     * @returns {string} - The JSON string containing the ranking.
     */
    calculateRanking() {
        const userScoresArray =  [];
        this.scores.forEach((value, key) => userScoresArray.push([key, value]));

        const scoreRanking = {};
        userScoresArray.forEach((userScore) => scoreRanking[userScore[0]] = userScore[1]);

        const sortedRanking = Object.fromEntries(
            Object.entries(scoreRanking).sort(([, a], [, b]) => b - a)
        );

        return JSON.stringify({ranking: sortedRanking});
    }
}

module.exports = Match;
