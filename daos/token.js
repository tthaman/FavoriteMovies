const mongoose = require('mongoose');

const Token = require('../models/token');
const { v4: uuidv4 } = require('uuid');

module.exports = {};

module.exports.create = async (userId) => {
    try {
        const token = await Token.create({ userId: userId, token: uuidv4() });
        return token;
    } catch (e) {
        throw e;
    }
}

module.exports.getUser = async (tokenString) => {
    const token = await Token.findOne({ token: tokenString });
    if (token) {
        return token.userId;
    } else {
        return false;
    }
}

module.exports.delete = async (token) => {
    try {
        await Token.deleteOne({ token: token });
        return true;
    } catch (e) {
        throw e;
    }
}