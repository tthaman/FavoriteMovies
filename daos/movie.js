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
  let { genre, service, age, order, filterByYear, filterByImdbRating, filterByRottenTomatoes } = movieObj;
  let genres;
  if (genre) {
    genres = genre;
  } else {
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
  const ageInt = { "0": 0, "7+": 7, "13+": 13, "18+": 18 };
  const movies = await Movie.find({
    Netflix: services.includes("netflix") ? 1 : 0,
    Hulu: services.includes("hulu") ? 1 : 0,
    PrimeVideo: services.includes("prime") ? 1 : 0,
    DisneyPlus: services.includes("disney") ? 1 : 0,
    Year: { $lt: currentYear - ageInt[age] + 1 },
  }).lean();
  return movies.filter((movie) => genres.some((v) => movie.Genres.includes(v)));
};

module.exports.searchTitle = async (titleString) => {
  const movies = await Movie.find({
    Title: { $regex: `.*${titleString}.*` },
  }).lean();
  return movies;
};

module.exports.searchDirector = async (directorString) => {
  const movies = await Movie.find({
    Directors: { $regex: `.*${directorString}.*` },
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
