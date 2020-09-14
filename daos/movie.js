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

module.exports.filterMovie = async (movieObj, page) => {
  let { genre, service, age, sort } = movieObj;
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

  const movieQuery = {
    Genres: genreSearch
  };

  if (service){
    if (service.includes("netflix")) {
      movieQuery.Netflix = 1
    }
    if (service.includes("hulu")) {
      movieQuery.Hulu = 1
    }
    if (service.includes("prime")) {
      movieQuery.PrimeVideo = 1
    }
    if (service.includes("disney")) {
      movieQuery.DisneyPlus = 1
    }
  }

  if(age) {
    if (Array.isArray(age)) {
      age.forEach(anAge => {
        // anAge = anAge.substring(0, anAge.length - 1);
        // ageArray.push(Number(anAge));
        ageArray.push(anAge);
      });
    } else {
      // ageArray.push( Number(age.substring(0, age.length - 1)));
      ageArray.push(age);
    }
    movieQuery.Age = {$in: ageArray}
  }

  if (sort) {
    if (sort === 'filterByIMDB') {
      sortBy = {IMDb: -1};
    }
    if (sort === 'filterByYear') {
      sortBy = {Year: -1};
    }
    if (sort === 'filterByRottenTomatoes') {
      sortBy = {RottenTomatoes: -1};
    }

  }
  let movies;
  if (page) {
    if (page > 0) {
      movies = await Movie.find(movieQuery).limit(20).skip(20 * (page - 1)).lean().sort(sortBy);
    } else {
      movies = await Movie.find(movieQuery).limit(20).skip(20 * (page)).lean().sort(sortBy);
    }
  } else {
    movies = await Movie.find(movieQuery).lean().sort(sortBy);
  }
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

module.exports.getPages = async (array) => {
  let movies, totalMovies, numPages;
  let pageArray = [];
  if(!array) {
    movies = await (await Movie.find().limit(600).lean());
    totalMovies = movies.length;
    numPages = Math.ceil(totalMovies / 20);
    for (let i = 1; i <= numPages; i++) {
      pageArray.push(i);
    }
    return pageArray;
  } else {
    totalMovies = array.length;
    numPages = Math.ceil(totalMovies / 20);
    for (let i = 1; i <= numPages; i++) {
      pageArray.push(i)
    }
    return pageArray;
  }
  
};
