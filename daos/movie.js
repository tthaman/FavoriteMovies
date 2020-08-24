const mongoose = require('mongoose');
const Movie = require('../models/movie');

module.exports = {};

module.exports.getAll = async () => {
  try {
    return await Movie.find().lean();
  } catch (e) {
    throw e;
  }
}

module.exports.getMovie = (movieId) => {
  try {
    return await Movie.findOne({ _id: movieId }).lean();
  } catch (e) {
    throw e;
  }
}

module.exports.createMovie = async (movieObj) => {
  try {
    // question
    return await Movie.create(movieObj),
    });
  } catch (e) {
    return;
  }
}

module.exports.updateMovie = async (movieId, newMovie) => {
  try {
    //  question
    await Movie.updateOne({ _id: movieId }, { $set: newMovie });
    return true;
  } catch (err) {
    return false;
  }
}

module.exports.deleteMovie = async (movieId) => {
  try {
    await Movie.deleteOne({ _id: movieId });
    return true;
  } catch (err) {
    return false;
  }
}
