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

module.exports.getAll = async () => {
  return await User.find().lean();
}

module.exports.getById = (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return false;
  } else {
    return User.findOne({ _id: userId }).lean();
  }
}

module.exports.getByEmail = async (email) => {
  return  await User.findOne({ email: email }).lean();
}

module.exports.removePassword = async (email) => {
  let user = await User.findOne({ email: email }, {password: 0});
  if (!user) {
      return false;
  } else {
      return user;
  }
}

module.exports.deleteByUserId = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return false;
  } else {
    await User.deleteOne({ _id: userId });
    return true;
  }
}

module.exports.create = async (userData) => {
  let user = await User.findOne({ email: userData.email});
  if (user) {
    return false;
  } else {
    userData.password = bcrypt.hashSync(userData.password, salt);
    userData.roles = ['user'];
    return await User.create(userData);
  }
}
