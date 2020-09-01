const Movie = require('../models/movie');

module.exports = {};

module.exports.getAll = async (page) => {
  const movies = await Movie.find().limit(20).skip(20*page).lean();
  return movies;
}

module.exports.getMovie = async (movieId) => {
  const aMovie = await Movie.findOne({ _id: movieId }).lean();
  return aMovie;
}

module.exports.createMovie = async (movieObj) => {
  return await Movie.create(movieObj);
}

module.exports.updateMovie = async (movieId, newMovie) => {
  return await Movie.updateOne({ _id: movieId }, { $set: newMovie });
}

module.exports.deleteMovie = async (movieId) => {
  return await Movie.deleteOne({ ID: movieId });
}

module.exports.getPages = async () => {
  const totalMovies = (await Movie.find().lean()).length;
  return Math.ceil(totalMovies / 20);
}
