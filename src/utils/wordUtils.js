const Word = require('../api/models/word');
const logger = require("../logger");

async function wordExists(word, dictionary) {
    let exists = false;
    const foundWord = await Word.findOne({word: word, dictionaryName: dictionary});
    if (foundWord !== null) {
    exists = true;
    }
    return exists;
}

async function evaluateWord(word, dictionary, letters) {
    let score = 0;
    if (await allCharactersValid(word, letters)) {
        logger.info(`all letters are valid for word ${word}`);
        const exists = await wordExists(word, dictionary);
        if (exists) {
            for (const letter of word) {
                score += await getLetterScore(letter);
            }
        }
    }
    return score;
}

async function getLetterScore(letter) {
    let score = 0;
    const category1 = ['E', 'A', 'I', 'O', 'S', 'N', 'R', 'L'];
    const category2 = ['T', 'U', 'D', 'C'];
    const category3 = ['M', 'P', 'B', 'V', 'G'];
    const category4 = ['Y', 'H', 'Q'];
    const category5 = ['F', 'J', 'Z'];
    const category6 = ['X', 'K', 'W'];

    if (category1.includes(letter.toUpperCase())) {
        score = 5;
    } else if (category2.includes(letter.toUpperCase())) {
        score = 7;
    } else if (category3.includes(letter.toUpperCase())) {
        score = 10;
    } else if (category4.includes(letter.toUpperCase())) {
        score = 13;
    } else if (category5.includes(letter.toUpperCase())) {
        score = 17;
    } else if (category6.includes(letter.toUpperCase())) {
        score = 20;
    }

    return score;
}

async function allCharactersValid(word, letters) {
    const lowerCaseWord = word.toLowerCase();

    for (let i = 0; i < lowerCaseWord.length; i++) {
        logger.info(`evaluating ${lowerCaseWord[i]}`)
        if (!letters.includes(lowerCaseWord[i])) {
            return false;
        }
    }
    return true;
}

module.exports = {
    wordExists,
    evaluateWord
}