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
 // console.log(movieObj);
 // const currentYear = new Date().getFullYear();
 // let { genre, service, age, order } = movieObj;
  //console.log(movieObj);
  if (!movieObj.genre) {
    movieObj.genre = [
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
  if (!movieObj.service) {
    movieObj.service = ["hulu", "prime", "netflix", "disney"];
  }
  if (!movieObj.age) {
    movieObj.age = ["7", "13", "18"];
  } 
  //const ageInt = { "0": 0, "7+": 7, "13+": 13, "18+": 18 };
  var genres = movieObj.genre.toString();
  var service = movieObj.service.toString();
  var age = movieObj.age.toString();
  console.log(genres);
  console.log(service);
  console.log(age);
  // const movies = await Movie.aggregate([
  //   { $match: { 
  //       $and: [
  //         { 
  //           "Age":  
  //             "18+"  }] } } 
  //   // Netflix: services.includes("netflix") ? 1 : 0,
  //   // Hulu: services.includes("hulu") ? 1 : 0,
  //   // PrimeVideo: services.includes("prime") ? 1 : 0,
  //   // DisneyPlus: services.includes("disney") ? 1 : 0,
  //   // Year: { $lt: currentYear - ageInt[age] + 1 },
  // ]);
  const movies = await Movie.find({ Genres: { $all: [genres] } });
  console.log(movies);
  return movies;
};

module.exports.searchTitle = async (titleString) => {
  const movies = await Movie.find({
    Title: { $regex: `.*${titleString}.*` },
  }).lean();
  return movies;
};

module.exports.searchTitle = async (titleString) => {
  const movies = await Movie.find(
    { $text: {$search: titleString}},
    { score: {$meta: "textScore"}}
    )
    .sort({ score: { $meta: "textScore" }})
    .limit(20).lean();
  return movies;
};

module.exports.searchDirector = async (directorString) => {
  const movies = await Movie.find({
    Directors: { $regex: `${directorString}`, '$options' : 'i' },
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
