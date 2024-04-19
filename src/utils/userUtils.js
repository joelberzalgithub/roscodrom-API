const User = require('../api/models/user');

function isValidUser(userTemplate) {
    const valid = true;
    if (userTemplate.nickname === undefined) {
        return !valid;
    }
    if (userTemplate.email === undefined) {
        return !valid;
    }
    if (userTemplate.phoneNumber === undefined) {
        return !valid;
    }
    if (userTemplate.avatar === undefined) {
        return !valid;
    }
    return valid;
}

async function isValidNickname(nickname) {
    const valid = true;
    const foundUser = await User.User.findOne({nickname: nickname});
    if (foundUser !== undefined) {
        return !valid;
    }
    return valid;
}

module.exports = {
    isValidUser:isValidUser,
    isValidNickname:isValidNickname
}