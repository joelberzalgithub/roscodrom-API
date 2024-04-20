const utils = require('../../utils/utils');
const userUtils = require('../../utils/userUtils')
const User = require('../models/user');
const express = require('express');
const logger = require('../../logger');
const router = express.Router();


router.post('/user/register', async (req, res) => {
    const body = req.body;
    let responseBody = {};

    logger.info(`Received request at /user/register`);
    try {
        userTemplate = new User.Template(body);
        let valid = await userUtils.isValidUser(userTemplate);
        if (!valid) {
            responseBody = utils.buildResponse(400, "Bad request.");
            res.status(400).send(responseBody);
            return;
        } 
        valid = await userUtils.isValidNickname(userTemplate.nickname);
        if (!valid) {
            responseBody = utils.buildResponse(409, "Conflict.");
            res.status(400).send(responseBody);
            return;
        }
        const user = await User.User.create(userTemplate);
        responseBody = utils.buildResponse(200, "Success", {apiKey: userTemplate.apiKey});
        res.send(responseBody);

    } catch (error) {
        logger.info(`An error happened while processing /user/register`, error);
        responseBody = utils.buildResponse(500, "Internal server error.");
        res.status(500).send(error.message);
    }
});


module.exports = router;