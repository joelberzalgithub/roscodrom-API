const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    matchId: String,
    language: String,
    letters: Array,
    words: Array,
    userScores: Map,
    startDate: String,
    endDate: String
});

const MatchModel = mongoose.model('match', MatchSchema);

module.exports = {
    MatchModel
}