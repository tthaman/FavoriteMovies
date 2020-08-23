const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = {};

module.exports.getByUserId = async (userId) => {
  return await User.findOne({ _id: userId }).lean();
}

module.exports.deleteByUserId = async (userId) => {
  return await User.delete({ _id: mongoose.Types.ObjectId(userId) });
}

module.exports.create = async (favorite) => {
  return await User.create(favorite);
}

// update movies array
module.exports.updateMovies = async (userId, movies) =>  {
  return await User.updateOne(
    { _id: mongoose.Types.ObjectId(userId) },
    {
      $set: { movies: movies },
      $currentDate: { lastModified: true }
    }
  )
};
