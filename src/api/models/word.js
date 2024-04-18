const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
    word: String,
    dictionaryName: String,
    guessCount: Number
});

const Word = mongoose.model('word', WordSchema);

module.exports = Word;