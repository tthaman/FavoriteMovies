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
  const currentYear = new Date().getFullYear();
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
    services = ["hulu", "prime", "netflix", "disney"];
  }
  if (!age) {
    age = "0";
  }
  if (!sort) {
    sort = title;
  }
  const ageInt = { "0": 0, "7+": 7, "13+": 13, "18+": 18 };
  const movies = await Movie.find({
    Genres: { $in: genres },
    Netflix: services.includes("netflix") ? 1 : 0,
    Hulu: services.includes("hulu") ? 1 : 0,
    PrimeVideo: services.includes("prime") ? 1 : 0,
    DisneyPlus: services.includes("disney") ? 1 : 0,
    Year: { $lt: currentYear - ageInt[age] + 1 },
  })
    .sort(order)
    .lean();
  return movies;
};

module.exports.searchTitle = async (titleString) => {
  const movies = await Movie.find({
    Title: { $regex: `.*${titleString}.*` },
  }).lean();
  return movies;
};

module.exports.searchDirector = async (directoryString) => {
  const movies = await Movie.find({
    Directors: { $regex: `.*${directoryString}.*` },
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
