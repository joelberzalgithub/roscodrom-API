const mongoose = require('mongoose');
const utils = require('../../utils/utils');

class UserTemplate {
    constructor(body) {
        this.uuid = utils.generateUUID();
        this.apiKey = utils.generateApiKey();
        this.nickname = body.nickname;
        this.email = body.email;
        this.phoneNumber = body.phoneNumber;
        this.avatar = body.avatar;
    }
}

const UserSchema = new mongoose.Schema({
    nickname: String,
    email: String,
    phoneNumber: String,
    avatar: String,
    uuid: String,
    apiKey: String
});

const User = mongoose.model('user', UserSchema);

module.exports = {
    User:User,
    Template:UserTemplate
};