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

module.exports = {
    isValidUser:isValidUser
}