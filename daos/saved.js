const mongoose = require('mongoose');
const Saved = require('../models/saved');

module.exports = {};

module.exports.getByEmail = async (email) => {
  return await Saved.findOne({ email: email }).lean();
}

module.exports.deleteByEmail = async (email) => {
  return await Saved.delete({ email: email });
}

module.exports.create = async (saveMe) => {
  const aCollection = await Saved.create(saveMe);
  return aCollection;
}

// update watchlist array
module.exports.updateWatchlist = async (email, watchlist) =>  {
  return await Saved.updateOne(
    { email: email },
    {
      $set: { watchlist: watchlist },
      $currentDate: { lastModified: true }
    }
  )
};

// update favorites array
module.exports.updateFavorites = async (email, favorites) =>  {
  return await Saved.updateOne(
    { email: email },
    {
      $set: { favorites: favorites },
      $currentDate: { lastModified: true }
    }
  )
};
