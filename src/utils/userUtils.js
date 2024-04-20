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

module.exports = {
    isValidUser:isValidUser,
    isValidNickname:isValidNickname
}