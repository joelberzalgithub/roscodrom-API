const Word = require('../api/models/word');

async function wordExists(word, dictionary) {
   var exists = false;
   var foundWord = await Word.findOne({word: word, dictionaryName: dictionary});
   if (foundWord !== null) {
    exists = true;
   }
   return exists;
}

module.exports = {
    wordExists:wordExists
}