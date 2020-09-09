const Movie = require("../models/movie");

module.exports = {};

module.exports.getAll = async (page) => {
  if (page > 0) {
    return await Movie.find()
      .limit(20)
      .skip(20 * (page - 1))
      .lean();
  } else {
    return await Movie.find()
      .limit(20)
      .skip(20 * page)
      .lean();
  }
};

module.exports.getMovie = async (movieId) => {
  const movieTemp = await Movie.findOne({ _id: movieId }).lean();
  return movieTemp;
};

module.exports.filterMovie = async (movieObj) => {
  let { genres, service, age, order } = movieObj;
  if (!genres) {
    genres = [
      "Action",
      "Comedy",
      "Thriller",
      "Sci-fi",
      "Western",
      "Adventure",
      "Horror",
      "Crime",
      "War",
      "Fantasy",
      "Drama",
      "Animated",
      "History",
      "Biography",
      "Romance",
    ];
  }
  if (!service) {
    service = ["hulu", "prime", "netflix", "disney"];
  }
  if (!age) {
    age = "0";
  }
  const ageInt = { "0": "0", "7%2B": "7", "13%2B": "13", "18%2B": "18" };
  const movies = await Movie.find({
    Age: { $gte: ageInt[age] },
  }).lean();
  let result = movies.filter((movie) => genres.some((v) => movie.Genres.includes(v)));
  result = result.filter((movie) => service.some((v) => movie[v]==1));
  return result;
};

module.exports.searchTitle = async (titleString) => {
  const movies = await Movie.find({
    Title: { $regex: `.*${titleString}.*` },
  }).lean();
  return movies;
};

module.exports.searchTitle = async (titleString) => {
  const movies = await Movie.find(
    { $text: { $search: titleString } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(20)
    .lean();
  return movies;
};

module.exports.searchDirector = async (directorString) => {
  const movies = await Movie.find({
    Directors: { $regex: `${directorString}`, $options: "i" },
  }).lean();
  return movies;
};

module.exports.getPages = async () => {
  const pageArray = [];
  const movies = await Movie.find().lean();
  const totalMovies = movies.length;
  const numPages = Math.ceil(totalMovies / 20);
  for (let i = 1; i <= numPages; i++) {
    pageArray.push(i);
  }
  return pageArray;
};
