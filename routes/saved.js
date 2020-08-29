const { Router } = require("express");
const router = Router();
const savedDAO = require('../daos/saved');
const movieDAO = require('../daos/movie');
const { isAuthorized } = require('../middleware/middleware');

//get user's savedMovieData...userId must have been set in request by middleware
router.get("/", isAuthorized, async (req, res, next) => {
  const email = req.email;
  try {
    let saved = await savedDAO.getByEmail(email);
    if (saved) {
      watchList = [];
      for (let i=0; i < saved.watchList.length; i++) {
        let watchMe = await movieDAO.findById(saved.watchList[i]);
        watchList.push(watchMe);
      }
      favorites = [];
      for (let i=0; i < saved.favorites.length; i++) {
        let loveMe = await movieDAO.findById(saved.watchList[i]);
        favorites.push(loveMe);
      }
      res.render('collection', {
        watchList: movieArray,
        favoriteMovies: movieArray
      })
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    res.sendStatus(400);
  }
});

// Update users watchlist.
router.post("/watchlist", isAuthorized,async (req, res, next) => {
  const aMovie = req.body;
  const email = req.email;
  let watchlist;
  let favorites;
  let updatedCollection;
  if (!aMovie || JSON.stringify(aMovie) === '{}') {
    //res.render(error html)
    res.status(400).send('Please provide movie to be added to watchlist"');
  } else {
    try {
      let savedEntry = await savedDAO.getByEmail(email);
      if (savedEntry) {
        const updatedWL = savedEntry.watchlist.push(aMovie._id);
        updatedCollection = await savedDAO.updateWatchlist(email, updatedWL)
        favorites = getMovies(updatedCollection.movieFavorites);
      } else {
        updatedCollection = await savedDAO.create(
          {email: email, watchList: [aMovie._id], favoriteMovies:[]}
        )
        favorites = [];
      }
      watchlist = await getMovies((updatedCollection.toJSON()).watchList);
      res.statusCode = 200;
      res.render("collection", {
        "watchList": watchlist,
        "favoriteMovies": favorites
      });
    } catch (e) {
      //res.render(error html)
    }
  }
});

// Update users favorites.
router.post("/favorites", isAuthorized,async (req, res, next) => {
  const aMovie = req.body;
  const email = req.email;
  let watchlist;
  let favorites;
  let updatedCollection;
  if (!aMovie || JSON.stringify(aMovie) === '{}') {
    //res.render(error html)
    res.status(400).send('Please provide movie to be added to watchlist"');
  } else {
    try {
      let savedEntry = await savedDAO.getByEmail(email);
      if (savedEntry) {
        const updatedFavs = savedEntry.movieFavorites.push(aMovie._id);
        updatedCollection = await savedDAO.updateFavorites(email, updatedFavs)
        watchlist = getMovies(updatedCollection.watchList);
      } else {
        updatedCollection = await savedDAO.create(
          {email: email, movieFavorites: [aMovie._id], favoriteMovies:[]}
        )
        watchlist = [];
      }
      favorites = await getMovies((updatedCollection.toJSON()).movieFavorites);
      res.statusCode = 200;
      res.render("collection", {
        "watchList": watchlist,
        "favoriteMovies": favorites
      });
    } catch (e) {
      //res.render(error html)
    }
  }
});

async function getMovies(someMovieIDs) {
  let movies = [];
  for (const id of someMovieIDs) {
    try {
      let aMovie = await movieDAO.getMovie(id.toJSON());
      movies.push(aMovie);
    } catch(e) {
      console.log(`Problem finding movie with ID ${id}`);
    }
  }
  return movies;
}

module.exports = router;
