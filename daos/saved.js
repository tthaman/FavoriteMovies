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
      //This only adds unique ids so no duplicates
      $addToSet: {watchList: {$each: watchlist}},
      $currentDate: { lastModified: true }
    }
  )
};

// update favorites array
module.exports.updateFavorites = async (email, favorites) =>  {
  return await Saved.updateOne(
    { email: email },
    {
      $addToSet: { favoriteMovies: {$each: favorites }},
      $currentDate: { lastModified: true }
    }
  )
};

module.exports.getByEmail = async (email) => {
  return await Saved.findOne({ email: email }).lean();
}

module.exports.removeFromWatchlist = async (id) => {
  return await Saved.updateOne(
    { $pull: { watchList: id }}
  )
}

module.exports.removeFromFavoriteMovies = async (id) => {
  return await Saved.updateOne(
    { $pull: { favoriteMovies: id }}
  )
}

module.exports.populateWatchlist = async (email) => {
  return await Saved.find({ email: email }).populate('watchList').lean();
}

module.exports.populateFavorites = async (email) => {
  return await Saved.find({ email: email }).populate('favoriteMovies').lean();
}
