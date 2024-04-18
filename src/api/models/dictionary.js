const mongoose = require('mongoose');

const DictionarySchema = new mongoose.Schema({
    language: String,
});

const Dictionary = mongoose.model('Dictionary', WordSchema);

module.exports = Dictionary;