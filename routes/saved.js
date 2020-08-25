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
router.post("/watchlist", async (req, res, next) => {
  const aMovie = req.body;
  const userId = req.userId;
  if (!aMovie || JSON.stringify(aMovie) === '{}') {
    //res.render(error html)
    res.status(400).send('Please provide movie to be added to watchlist"');
  } else {
    try {
      const updatedWL = await savedDAO.updateWatchlist(userId, aMovie._id);
      //res.render(movie view)
      res.json(updatedWL);
    } catch (err) {
      //res.render(error html)
    }
  }
});

// Update users favorites.
router.post("/favorites", async (req, res, next) => {
  const aMovie = req.body;
  const userId = req.userId;
  if (!aMovie || JSON.stringify(aMovie) === '{}' ) {
    //res.render(error html)
    res.status(400).send('Please provide movie to be added to favorites"');
  } else {
    const updatedFav = await savedDAO.updateFavorites(userId, aMovie._id);
    //res.render(movie view)
    res.json(updatedFav);
  }
});

module.exports = router;
