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
  let isHulu = 0;
  let isDisney = 0;
  let isNetflix = 0;
  let isPrime = 0
  let sortBy;

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

  if (service){
    if (service.includes("netflix")) {isNetflix = 1}
    if (service.includes("hulu")) {isHulu = 1}
    if (service.includes("prime")) {isPrime = 1}
    if (service.includes("disney")) {isDisney = 1}
  }

  const movieQuery = {
    Genres: genreSearch,
    Netflix: isNetflix,
    Hulu: isHulu,
    PrimeVideo: isPrime,
    DisneyPlus: isDisney
  };

  if(age) {
    if (Array.isArray(age)) {
      age.forEach(anAge => {
        anAge = anAge.substring(0, anAge.length - 1);
        ageArray.push(Number(anAge));
      });
    } else {
      ageArray.push( Number(age.substring(0, age.length - 1)));
    }
    movieQuery.Age = {$in: ageArray}
  }

  if (filterByYear) sortBy = {Year: -1};
  if (filterByIMDB) sortBy = {IMDb: -1};
  if (filterByRottenTomatoes) sortBy = {RottenTomatoes: -1};

  const movies = await Movie.find(movieQuery).lean().sort(sortBy);
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
