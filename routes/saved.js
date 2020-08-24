const { Router } = require("express");
const router = Router();
const savedDAO = require('../daos/saved');

//get user's savedMovieData...userId must have been set in request by middleware
router.get("/", async (req, res, next) => {
  const userId = req.userId;
  try {
    let saved = await savedDAO.getByUserId(userId);
    if (saved) {
      res.render('index', {
        movies: ['item one', 'other', 'new item']
      });
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    res.sendStatus(400);
  }
});

// Update users watchlist.
router.put("/watchlist/:movieId", async (req, res, next) => {
  const movieId = req.params.movieId;
  const userId = req.userId;
  if (!movieId ) {
    //res.render(error html)
    res.status(400).send('Please provide movie to be added to watchlist"');
  } else {
    try {
      const updatedWL = await savedDAO.updateWatchlist(userId, movieId);
      //res.render(movie view)
      res.json(updatedWL);
    } catch (err) {
      //res.render(error html)
    }
  }
});

// Update users favorites.
router.put("/favorites/:movieId", async (req, res, next) => {
  const movieId = req.params.movieId;
  const userId = req.userId;
  if (!saveMe || JSON.stringify(movieId) === '{}' ) {
    //res.render(error html)
    res.status(400).send('Please provide movie to be added to favorites"');
  } else {
    const updatedFav = await savedDAO.updateFavorites(userId, movieId);
    //res.render(movie view)
    res.json(updatedFav);
  }
});

module.exports = router;
