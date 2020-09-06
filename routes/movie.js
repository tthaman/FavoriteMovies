const { Router } = require("express");
const router = Router();

const movieDAO = require("../daos/movie");
const { isAuthorized, isAdmin } = require("../middleware/middleware");

// GET /movies/search/:search_text Retrieves potential matches
router.get("/search/:search_text", async (req, res, next) => {
  if (req.query.searchType == "Title")
    const movies = await movieDAO.searchTitle(req.query.query);
  else {
    const movies = await movieDAO.searchDirector(req.query.query);
  }
  res.statusCode = 200;
  res.render("index", {
    movieArray: movies,
  });
});

// GET /movies/filter Retrieves potential matches
router.get("/filter", async (req, res, next) => {
  const movies = await movieDAO.filter(req.params.body);
  res.statusCode = 200;
  res.render("index", {
    movieArray: movies,
  });
});

// GET /movies/:id Retrieves a specific movie
router.get("/:id", async (req, res, next) => {
  const movie = await movieDAO.getMovie(req.params.id);
  res.render("movie", {
    movieData: movie,
  });
});

//GET /movies Retrieves all movies
router.get("/", async (req, res, next) => {
  console.log(req.query);
  let { page } = req.query;
  page = page ? Number(page) : 1;
  const pages = await movieDAO.getPages();
  const movies = await movieDAO.getAll(page);
  res.statusCode = 200;
  if (req.session.token) {
    res.render("index", {
      movieArray: movies,
      pages: pages,
      currentPage: page,
      isLoggedIn: true,
    });
  }
  res.render("index", {
    movieArray: movies,
    pages: pages,
    currentPage: page,
  });
});

module.exports = router;
