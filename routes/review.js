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

function convertStarRating(rating) {
  const roundedRating = Math.round(rating)
  let ratingArray = [false, false, false, false, false];
  for(let i = 0; i < roundedRating; i++) {
    ratingArray[i] = true;
  }
  return ratingArray
}

router.get('/:id', isAuthorized, async (req, res, next) => {
  const { id } = req.params;
  const movieData = await movieDAO.getMovie(id);
  const reviews = await reviewDAO.findAllByMovieId(id);
  const avgArray = await reviewDAO.getAvgRatingByMovieId(id);
  const avgRating = (avgArray && avgArray.length > 0) ? avgArray[0].averageRating : 0
  console.log(reviews);
  res.render("review", {
    "reviews": reviews,
    "numReviews": reviews.length,
    "movieData": movieData,
    "avgRating": avgRating,
    "userStarRating": avgRating
  });
});

router.get('/:id/add-review', isAuthorized, async (req, res, next) => {
  const { id } = req.params;
  const movie = await movieDAO.getMovie(id);
  console.log(movie)
  if (movie) {
    res.render("reviewForm", { id: id, title: movie.Title });
  }
});

router.post('/:id/add-review', isAuthorized, async(req, res, next) => {
  const { rating, review } = req.body;
  const { id } = req.params;
  const email = req.session.token.userId;
  if (!rating || !review ) {
    res.status(400).send('rating and review required"');
  } else {
    const aReview = {
      email: email,
      review: review,
      rating: rating,
      movieId: id
    }
    try {
      await reviewDAO.create(aReview);
      res.redirect("/movie/" + id);
    } catch(error) {
      res.status(400).send(`Review not saved due to ${error.message}`);
    }
  }
});

module.exports = router;
