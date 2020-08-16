const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(12);

module.exports = {};

// updateUserPassword(userId, password) - should update the user's password field
module.exports.updateUserPassword = async (email, password) =>  {
  password = bcrypt.hashSync(password, salt);

  return await User.updateOne(
    { email: email },
    {
      $set: { password: password },
      $currentDate: { lastModified: true }
    }
  )
};

module.exports.getById = async (userId) => {
  return await User.findOne({ _id: userId }).lean();
}

module.exports.getByEmail = async (email) => {
  return  await User.findOne({ email: email }).lean();
}

module.exports.deleteByUserId = async (userId) => {
  return await User.delete({ _id: mongoose.Types.ObjectId(userId) });
}

module.exports.create = async (userData) => {
  userData.password = bcrypt.hashSync(userData.password, salt);
  userData.roles = ['user'];
  return await User.create(userData);
}
