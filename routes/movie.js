const { Router } = require("express");
const router = Router();

const movieDAO = require("../daos/movie");
const { isAuthorized, isAdmin } = require("../middleware/middleware");

//GET /movies Retrieves all movies
router.get("/", async (req, res, next) => {
  console.log(req.query)
  const movies = await movieDAO.getAll();
  res.statusCode = 200;
  res.render("index", {
    "movieArray": movies
  });
});

// GET /movies/:id Retrieves a specific movie
router.get("/:id", async (req, res, next) => {
  const movie = await movieDAO.getMovie(req.params.id));
  res.render("movie", {
    "movieData": movie
  });
});

// GET /movies/search/:search_text Retrieves potential matches
router.get("/search/:movie_text", async (req, res, next) => {
  const movies = await movieDAO.searchTitle();
  res.statusCode = 200;
  res.render("index", {
    "movieArray": movies
  });
});

// GET /movies/filter Retrieves potential matches
router.get("/filter", async (req, res, next) => {
  const movies = await movieDAO.filter(req.params.body);
  res.statusCode = 200;
  res.render("index", {
    "movieArray": movies
  });
});

module.exports = router;
