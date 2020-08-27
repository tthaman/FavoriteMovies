const mongoose = require('mongoose');
const User = require('../models/user');
const Token = require('../models/token');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(12);

module.exports = {};

// updateUserPassword(userId, password) - should update the user's password field
module.exports.updateUserPassword = async (token, password) =>  {
  const user = await Token.findOne({ token: token });
  if (user) {
    newPassword = await bcrypt.hashSync(password, salt);
    return await User.updateOne(
        { email: user.userId }, 
        {
        $set: { password: newPassword },
        $currentDate: { lastModified: true }
        })
  } else {
    return false;
  }
};

// module.exports.updateById = async (userId, firstName, lastName) => {
//   const user = await User.updateOne({ _id: userId, firstName: firstName, lastName: lastName });
//   if (user) {
//       return user;
//   } else {
//       return false;
//   }
// }
// module.exports.getAll = async () => {
//   return await User.find().lean();
// }

// module.exports.getById = (userId) => {
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return null;
//   } else {
//     return User.findOne({ _id: userId }).lean();
//   }
// }

module.exports.getByEmail = async (email) => {
  return  await User.findOne({ email: email }).lean();
}

// module.exports.deleteByUserId = async (userId) => {
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return false;
//   } else {
//     await User.deleteOne({ _id: userId });
//     return true;
//   }
// }

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
