const express = require('express');
const Word = require('../models/word');
const logger = require('../../logger');
const wordUtils = require('../../utils/wordUtils');
const utils = require('../../utils/utils');
const router = express.Router();


router.get('/words/:dictionary', async (req, res) => {
    logger.info(`Received request at /words/:dictionary`);
    try {
        const page = req.query.page;
        const size = req.query.size;
        const skip = (page - 1) * size;

        const words = await Word.find({dictionaryName: req.params.dictionary}).skip(skip).limit(size);
        if (!words) {
            return res.status(404).send("No words found");
        }
        res.send(words);
    } catch (error) {
        logger.error(`An error happened processing /get/words/:dictionary request`, error);
        res.status(500).send(error.message);
    }
}); 

router.get('/word/:name', async (req, res) => {
  logger.info(`Received request at /word/:name`);
  try {
    const word = await Word.findOne({word: req.params.name});
    if (!word) {
      return res.status(404).send("The word was not found");
    }
    res.send(word);
  } catch (error) {
    logger.error(`An error happened processing /get/word/:name request`, error);
    res.status(500).send(error.message);
  }
});

router.post('/word/:dictionary', async (req, res) => {
  logger.info(`Received request at /word/:dictionary`);
  try {
    const word = req.body.word;
    const dictionary = req.params.dictionary;
    if (word === null || word === undefined ) {
      return res.status(400).send(utils.buildResponse(400, "Bad request."));
    }
    const exists = await wordUtils.wordExists(word, dictionary);
    if (exists) {
      return res.status(409).send(utils.buildResponse(409, "Conflict."));
    }
    const createdWord = await Word.create({word: word, guessCount: 0, dictionaryName: dictionary});
    return res.send(utils.buildResponse(200, "Success", createdWord));
  } catch (error) {
    logger.error(`An error happened processing /word/add request`, error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
