const express = require('express');
const Word = require('../models/word');
const logger = require('../../logger');
const router = express.Router();


router.get('/words/:dictionary', async (req, res) => {
    logger.info(`Received request at /get/words/:dictionary`);
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
  logger.info(`Received request at /get/word/:name`);
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

module.exports = router;
