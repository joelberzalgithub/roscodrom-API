const utils = require('../../utils/utils');
const userUtils = require('../../utils/userUtils')
const User = require('../models/user');
const express = require('express');
const router = express.Router();


router.post('/user/register', async (req, res) => {
    const body = req.body;
    let responseBody = {};
    try {
        userTemplate = new User.Template(body);
        if (userUtils.isValidUser(userTemplate)) {
            const user = await User.User.create(userTemplate);

            responseBody = utils.buildResponse(200, "Success", {apiKey: userTemplate.apiKey});
            res.send(responseBody);

        } else {
            responseBody = utils.buildResponse(400, "Bad request.");
            res.status(400).send(responseBody);
        }

    } catch (error) {
        responseBody = utils.buildResponse(500, "Internal server error.");
        res.status(500).send(error.message);
    }
});


module.exports = router;