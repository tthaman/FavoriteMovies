const { Router } = require("express");
const router = Router();
const reviewDAO = require('../daos/review');
const movieDAO = require('../daos/movie');
const { isAuthorized } = require("../middleware/middleware");

// Check for saved movie with userId.  If found, update movies array.  Else, create saved movie with 1 instance in movies.
router.put("/:id", async (req, res, next) => {
  const noteId = req.params.id;
  const note = req.body;
  if (!note || JSON.stringify(note) === '{}' ) {
    res.status(400).send('note is required"');
  } else {
    const updatednote = await noteDAO.updateById(noteId, note);
    res.json(updatednote);
  }
});

router.get('/:id/add-review', isAuthorized, async (req, res, next) => {
  const { id } = req.params;
  const movie = await movieDAO.getMovie(id);
  console.log(movie)
  if (movie) {
    res.render("reviewForm", { id: id, title: movie.Title });
  }
})

router.post('/:id/add-review', (req, res, next) => {
  const { rating, review } = req.body;
  const { id } = req.params;
  if (!rating || !review ) {
    res.status(400).send('rating and review required"');
  } else {
    res.render("reviewForm", {message: true})
  }
})

module.exports = router;
