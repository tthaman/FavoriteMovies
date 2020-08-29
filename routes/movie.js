const { Router } = require("express");
const router = Router();

const movieDAO = require("../daos/movie");
const { isAuthorized, isAdmin } = require("../middleware/middleware");

//GET /movies Retrieves all movies
router.get("/", async (req, res, next) => {
  const movies = await movieDAO.getAll();
  res.statusCode = 200;
  res.render("index", {
    "movieArray": movies
  });
});

// GET /movies/:id Retrieves a specific movie
router.get("/:id", async (req, res, next) => {
  return res.json(await movieDAO.getMovie(req.params.id));
});

// POST /movies Adds a new movie to database (Requires Admin Role)
router.post("/", isAuthorized, isAdmin, async (req, res, next) => {
  if (!req.body) {
    return res.status(400).send("Missing item");
  }
  const movie = await movieDAO.createMovie(req.body);
  if (!movie) {
    return res.status(400).send("Create movie failed");
  }
  res.json(movie);
});

// PUT /movies/:id Updates a specific movie (Requires Admin Role)
router.put("/:id", isAuthorized, isAdmin, async (req, res, next) => {
  if (!req.body) {
    return res.status(400).send("Missing item");
  }
  const movie = await movieDAO.updateMovie(req.params.id, req.body);
  if (!movie) {
    return res.status(400).send("Create movie failed");
  }
  res.json(movie);
});

// DELETE /movies/:id removes a movie from database (Requires Admin Role)
router.delete("/:id", isAuthorized, isAdmin, async (req, res, next) => {
  const success = await movieDAO.deleteMovie(req.params.id, req.body);
  if (!success) {
    return res.status(400).send("Create movie failed");
  }
  res.status(200).send("Movie Deleted");
});

module.exports = router;
