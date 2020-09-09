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
  let { genre, service, age, filterByYear, filterByIMDB, filterByRottenTomatoes } = movieObj;
  let genreExp;
  let ageArray = [];
  let genreSearch;

  if(genre) {
    if(Array.isArray(genre)) {
      genre.forEach(aGenre => {
        genreExp = genreExp + `.*${aGenre}.*|`;
      });
      genreExp = genreExp.substring(9, (genreExp.length - 1));
      genreSearch = {$regex:genreExp};
    } else {
      genreSearch = {$regex:`.*${genre}.*`};
    }
  } else {
    genreSearch = {$regex:`.`};
  }

  if(age) {
    if (Array.isArray(age)) {
      age.forEach(anAge => {
        anAge = anAge.substring(0, anAge.length - 1);
        ageArray.push(Number(anAge));
      });
    } else {
      ageArray.push( Number(age.substring(0, age.length - 1)));
    }
  } else {
    ageArray = [7,13,18]
  }

  const movies = await Movie.find({
    Genres: genreSearch,
    Netflix: service.includes("netflix") ? 1 : 0,
    Hulu: service.includes("hulu") ? 1 : 0,
    PrimeVideo: service.includes("prime") ? 1 : 0,
    DisneyPlus: service.includes("disney") ? 1 : 0,
    Age: {$in: ageArray}
  }).lean();
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
