const { Router } = require("express");
const router = Router();
const savedDAO = require('../daos/saved');
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
  if (!aMovie || JSON.stringify(aMovie) === '{}') {
    //res.render(error html)
    res.status(400).send('Please provide movie to be added to watchlist"');
  } else {
    try {
      const savedEntry = await savedDAO.getByEmail(email);
      if (savedEntry) {
          const updatedWL = savedEntry.watchlist.push(aMovie._id);
          const updatedEntry = await savedDAO.updateWatchlist(email, updatedWL)
      } else {
        const newEntry = await savedDAO.create(
          {email: email, watchlist: [aMovie._id], favoriteMovies:[]}
          )
      }
      //res.render(movie view)
      res.json(updatedWL);
    } catch (err) {
      //res.render(error html)
    }
  }
});

// Update users favorites.
router.post("/favorites", isAuthorized,async (req, res, next) => {
  const aMovie = req.body;
  const email = req.email;
  if (!aMovie || JSON.stringify(aMovie) === '{}' ) {
    //res.render(error html)
    res.status(400).send('Please provide movie to be added to favorites"');
  } else {
    const currentFavs = await savedDAO.getByUserId().favoriteMovies;

    const updatedFav = await savedDAO.updateFavorites(email, aMovie._id);
    //res.render(movie view)
    res.json(updatedFav);
  }
});

module.exports = router;
