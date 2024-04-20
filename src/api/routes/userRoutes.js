const express = require('express');
const logger = require('../../logger');
const utils = require('../../utils/utils');
const userUtils = require('../../utils/userUtils');
const User = require('../models/user');

const router = express.Router();

router.post('/user/register', async (req, res) => {
    logger.info(`Received request at /user/register`);
    try {
        const userTemplate = new User.Template(req.body);
        let valid = await userUtils.isValidUser(userTemplate);
        if (!valid) {
            return res.status(400).send(utils.buildResponse(400, "Bad request."));
        }
        valid = await userUtils.isValidNickname(userTemplate.nickname);
        if (!valid) {
            return res.status(409).send(utils.buildResponse(409, "Conflict."));
        }
        const user = await User.User.create(userTemplate);
        return res.send(utils.buildResponse(200, "Success", {apiKey: userTemplate.apiKey}));
    } catch (error) {
        logger.error(`An error occurred while processing /user/register`, error);
        return res.status(500).send(utils.buildResponse(500, "Internal server error."));
    }
});

module.exports = router;
