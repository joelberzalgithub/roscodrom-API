//const utils = require('./utils/utils');
const User = require('../models/user');
const express = require('express');
const router = express.Router();


router.post('/user/register', async (req, res) => {
    const body = req.body;
    try {
        userTemplate = new User.Template(body);
        const user = await User.User.create(userTemplate);
        res.send(userTemplate.apiKey);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = router;