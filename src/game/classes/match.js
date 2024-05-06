const logger = require('../../logger');
const { MatchModel } = require('../../api/models/match');
const utils = require('../../utils/utils');

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
        this.words = [];
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
            this.letters = this.generateLetters();
            
            this.matchStarted = true;
            this.room.broadcast('matchStart', JSON.stringify(
                {
                    message: 'The match has started!',
                    letters: this.letters
                }));
                
            this.insertMatchOnDB();
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
        
        else if (remainingMillis === 0) {
            logger.info(`Room ${this.room.id} match has ended`);
            clearInterval(this.initiateTimer);

            this.updateMatchEndDate();
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

    /**
     * Generates an array of 10 letters, of which at least 2 are vowels.
     *
     * @returns Array of ten letters.
     */
    generateLetters() {
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const consonants = 'bcdfghjklmnpqrstvwxyz'.split('');

        let letters = [];
        let vowelCount = 0;

        for (let i = 0; i < 10; i++) {
            let letter;
            if (vowelCount < 2 || Math.random() < 0.2) {
                const vowelIndex = Math.floor(Math.random() * vowels.length);
                letter = vowels[Math.floor(vowelIndex)];
                vowels.splice(vowelIndex, 1);
                vowelCount++;
            } else {
                const consonantIndex = Math.floor(Math.random() * consonants.length);
                letter = consonants[Math.floor(consonantIndex)];
                consonants.splice(consonantIndex, 1);
            }
            letters.push(letter);
        }

        return letters;
    }

    /**
     * Inserts the match on it's starting status on the mongoDB database.
     * 
     */
    insertMatchOnDB() {
        MatchModel.create({
            matchId: this.room.id,
            letters: this.letters,
            language: "catalan",
            startDate: utils.getISOTimestampWithMilliseconds(),
            userScores: JSON.parse(this.calculateRanking()).ranking,
            endDate: null,
            words: this.words
        });
    }

    async updateMatchWords(word, score, user) {
        try {
            const match = await MatchModel.findOne({matchId: this.room.id});
            let wordArray = match.words || [];
            wordArray.push(word);

            const previousScore = this.scores.get(user.nickname);
            this.scores.set(user.nickname, score + previousScore);

            const userScores = JSON.parse(this.calculateRanking());
            await MatchModel.updateOne(
                {matchId: this.room.id},
                {words: wordArray, userScores: userScores});
        }
        catch (error) {
            logger.error(`Error while updating match ${this.room.id} words.`, error);
        }
    }

    async isWordFound(word) {
        let found = false;
        try {
            const match = await MatchModel.findOne({matchId: this.room.id});
            const wordArray = match.words || [];
            found = wordArray.includes(word);

        } catch (error) {
            logger.error(`Error while checking if ${word} is already found`, error);
        }
        return found;
    }

    /**
     * Updates the match endDate on the mongoDB database.
     * 
     */
    async updateMatchEndDate() {
        try {
            await MatchModel.updateOne({matchId: this.room.id}, {endDate: utils.getISOTimestampWithMilliseconds()});
        }
        catch (error) {
            logger.error(`Error while updating match ${this.room.id} end date.`, error);
        }
    }

}

module.exports = Match;
