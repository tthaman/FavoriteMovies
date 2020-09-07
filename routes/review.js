const { Router } = require("express");
const router = Router();
const reviewDAO = require('../daos/review');
const movieDAO = require('../daos/movie');

const { isAuthorized } = require("../middleware/middleware");

function convertStarRating(rating) {
  const roundedRating = Math.round(rating)
  let ratingArray = [false, false, false, false, false];
  for(let i = 0; i < roundedRating; i++) {
    ratingArray[i] = true;
  }
  return ratingArray
}

router.get('/:id', async (req, res, next) => {
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
    "userStarRating": avgRating ? convertStarRating(avgRating) : convertStarRating(0)
  });
});

router.get('/:id/add-review', isAuthorized, async (req, res, next) => {
  const { id } = req.params;
  const movie = await movieDAO.getMovie(id);
  if (movie) {
    console.log(movie)
    res.render("reviewForm", { id: movie._id, title: movie.Title });
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
