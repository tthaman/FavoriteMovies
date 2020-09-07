const { Router } = require("express");
const router = Router();
const savedDAO = require('../daos/saved');
const movieDAO = require('../daos/movie');
const { isAuthorized } = require('../middleware/middleware');

router.get("/", isAuthorized, async (req, res, next) => {
  const email = req.session.token.userId;
  let watchlist;
  let favoriteMovies;
  try {
    let saved = await savedDAO.getByEmail(email);
    if (saved) {
      watchlist = await savedDAO.populateWatchlist(email);
      favoriteMovies = await savedDAO.populateFavorites(email);
      res.render("collection", {
        "watchList": watchlist[0].watchList,
        "favoriteMovies": favoriteMovies[0].favoriteMovies
      })
    } else {
      res.render("collection", {
        "watchList": watchlist,
        "favoriteMovies": favoriteMovies
      })
    }
  } catch (e) {
    res.sendStatus(400);
  }
});

// Update users watchlist.
router.post("/watchlist/:id", isAuthorized,async (req, res, next) => {
  const email = req.session.token.userId;
  const { id } = req.params;
  let updatedCollection;
  if (!email) {
    res.render("signup", { message: true });
  } else {
      let savedEntry = await savedDAO.getByEmail(email);
      if (savedEntry) {
        console.log("Huh?")
        console.log(savedEntry.watchList)
        const updatedWL = [...savedEntry.watchList, id];
        updatedCollection = await savedDAO.updateWatchlist(email, updatedWL);
        if(updatedCollection) {
          let watchlist = await savedDAO.populateWatchlist(email);
          let favoriteMovies = await savedDAO.populateFavorites(email);
          res.statusCode = 200;
          res.render("collection", {
            "watchList": watchlist[0].watchList,
            "favoriteMovies": favoriteMovies[0].favoriteMovies
          });
        } else {
          res.render("error", { message: "Oops, server error", isLoggedIn: true })
        }
      } else {
        updatedCollection = await savedDAO.create(
          {email: email, watchList: [id], favoriteMovies:[]}
        )
        if(updatedCollection) {
          res.statusCode = 200;
          res.render("collection", {
            "watchList": watchlist[0].watchList,
            "favoriteMovies": favoriteMovies[0].favoriteMovies
          });
        } else {
          res.render("error", { message: "Oops, server error", isLoggedIn: true })
        }
      }

  }
});

router.post("/watchlist/:id/remove", isAuthorized,async (req, res, next) => {
  const email = req.session.token.userId;
  const { id } = req.params;
  let updatedCollection;
  console.log("hello")
  if (!email) {
    res.render("signup", { message: true });
  } else {
      let savedEntry = await savedDAO.getByEmail(email);
      if (savedEntry) {
        updatedCollection = await savedDAO.removeFromWatchlist(id);
        console.log(updatedCollection)
        if(updatedCollection) {
          let watchlist = await savedDAO.populateWatchlist(email);
          let favoriteMovies = await savedDAO.populateFavorites(email);
          res.statusCode = 200;
          res.render("collection", {
            "watchList": watchlist[0].watchList,
            "favoriteMovies": favoriteMovies[0].favoriteMovies
          });
        } else {
          res.render("error", { message: "Oops, server error", isLoggedIn: true })
        }
      } else {
        res.statusCode = 500;
      }

  }
});

// Update users favorites.
router.post("/favorites/:id", isAuthorized,async (req, res, next) => {
  const email = req.session.token.userId;
  const { id } = req.params;
  let updatedCollection;
  if (!email) {
    res.render("signup", { message: true });
  } else {
    let savedEntry = await savedDAO.getByEmail(email);
      let watchlist = await savedDAO.populateWatchlist(email);
      let favoriteMovies = await savedDAO.populateFavorites(email);
      if (savedEntry) {
        const updatedFavorites = [...savedEntry.favoriteMovies, id];
        updatedCollection = await savedDAO.updateFavorites(email, updatedFavorites);
        if(updatedCollection) {
          res.statusCode = 200;
          res.render("collection", {
            "watchList": watchlist[0].watchList,
            "favoriteMovies": favoriteMovies[0].favoriteMovies
          });
        } else {
          res.render("error", { message: "Oops, server error", isLoggedIn: true })
        }
      } else {
        updatedCollection = await savedDAO.create(
          {email: email, watchList: [], favoriteMovies:[id]}
        )
        if(updatedCollection) {
          res.statusCode = 200;
          res.render("collection", {
            "watchList": watchlist[0].watchList,
            "favoriteMovies": favoriteMovies[0].favoriteMovies
          });
        } else {
          res.render("error", { message: "Oops, server error", isLoggedIn: true })
        }
      }
  }

});

router.post("/favorites/:id/remove", isAuthorized,async (req, res, next) => {
  const email = req.session.token.userId;
  const { id } = req.params;
  let updatedCollection;
  console.log("hello")
  if (!email) {
    res.render("signup", { message: true });
  } else {
      let savedEntry = await savedDAO.getByEmail(email);
      if (savedEntry) {
        updatedCollection = await savedDAO.removeFromFavoriteMovies(id);
        console.log(updatedCollection)
        if(updatedCollection) {
          let watchlist = await savedDAO.populateWatchlist(email);
          let favoriteMovies = await savedDAO.populateFavorites(email);
          res.statusCode = 200;
          res.render("collection", {
            "watchList": watchlist[0].watchList,
            "favoriteMovies": favoriteMovies[0].favoriteMovies
          });
        } else {
          res.render("error", { message: "Oops, server error", isLoggedIn: true })
        }
      } else {
        res.statusCode = 500;
      }
  }
});

module.exports = router;
