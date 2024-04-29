const User = require('../api/models/user');

async function isValidUser(userTemplate) {
    let valid = true;
    if (userTemplate.nickname === undefined) {
        valid = false;
    }
    else if (userTemplate.email === undefined) {
        valid = false;
    }
    else if (userTemplate.phoneNumber === undefined) {
        valid = false;
    }
    return valid;
}

async function isValidNickname(nickname) {
    let valid = true;
    const foundUser = await User.User.findOne({nickname: nickname});
    if (foundUser !== null) {
        valid = !valid;
    }
    return valid;
}

async function findUserByNickname(nickname) {
    const user = await User.User.findOne({nickname: nickname});
    return user;
}

async function authenticateUser(nickname, apiKey) {
    const user = await User.User.findOne({nickname: nickname, apiKey: apiKey});
    return user;
}

module.exports = {
    isValidUser,
    isValidNickname,
    findUserByNickname,
    authenticateUser
}