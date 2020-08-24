const mongoose = require('mongoose');
const Movie = require('../models/movie');

module.exports = {};


module.exports.getOneMovie = async () => {
  return await Movie.findOne({}).lean();
}

module.exports.findById = async (movieId) => {
  return await Movie.findOne({ _id: movieId }).lean();
}

module.exports.deleteByMovieId = async (movieId) => {
  return await Movie.delete({ _id: mongoose.Types.ObjectId(movieId) });
}

module.exports.create = async (movie) => {
  return await Movie.create(movie);
}
