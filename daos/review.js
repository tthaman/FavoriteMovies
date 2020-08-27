const mongoose = require('mongoose');
const Review = require('../models/review');

module.exports = {};

module.exports.findAllByUserId = async (userId) => {
  return await Review.find({ userId: userId }).lean();
}

module.exports.findAllByMovieId = async (movieId) => {
  return await Review.find({ movieId: movieId }).lean();
}

module.exports.deleteByUserId = async (userId) => {
  return await Review.delete({ userId: mongoose.Types.ObjectId(userId) });
}

module.exports.deleteByMovieId = async (movieId) => {
  return await Review.delete({ movieId: mongoose.Types.ObjectId(movieId) });
}

module.exports.create = async (review) => {
  return await Review.create(review);
}

// update review
module.exports.updateMovies = async (userId, movieId, review, rating) =>  {
  return await Review.updateOne(
    { userId: mongoose.Types.ObjectId(userId), movieId: mongoose.Types.ObjectId(movieId) },
    {
      $set: {
        review: review,
        rating: rating,
        createdAt: Date.now
      },
      $currentDate: { lastModified: true }
    }
  )
};
