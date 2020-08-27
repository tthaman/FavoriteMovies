const mongoose = require('mongoose');
const Saved = require('../models/saved');

module.exports = {};

module.exports.getByUserId = async (userId) => {
  return await Saved.findOne({ userId: userId }).lean();
}

module.exports.deleteByUserId = async (userId) => {
  return await Saved.delete({ userId: mongoose.Types.ObjectId(userId) });
}

module.exports.create = async (saveMe) => {
  return await Saved.create(saveMe);
}

// update watchlist array
module.exports.updateWatchlist = async (userId, watchlist) =>  {
  return await Saved.updateOne(
    { userId: mongoose.Types.ObjectId(userId) },
    {
      $set: { watchlist: watchlist },
      $currentDate: { lastModified: true }
    }
  )
};

// update favorites array
module.exports.updateFavorites = async (userId, favorites) =>  {
  return await Saved.updateOne(
    { userId: mongoose.Types.ObjectId(userId) },
    {
      $set: { favorites: favorites },
      $currentDate: { lastModified: true }
    }
  )
};
