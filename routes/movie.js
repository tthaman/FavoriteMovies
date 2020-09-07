const { Router } = require("express");
const router = Router();

const movieDAO = require("../daos/movie");
const reviewDAO = require("../daos/review");


// GET /movies/search/:search_text Retrieves potential matches
router.get("/search", async (req, res, next) => {
  if (req.query.searchType == "Title") {
    const movies = await movieDAO.searchTitle(req.query.query);
  } else {
    const movies = await movieDAO.searchDirector(req.query.query);
  }
  res.statusCode = 200;
  res.render("index", {
    movieArray: movies,
  });
});

// GET /movies/filter Retrieves potential matches
router.get("/filter", async (req, res, next) => {
  const movies = await movieDAO.filter(req.query);
  res.statusCode = 200;
  res.render("index", {
    movieArray: movies,
  });
});

function convertStarRating(rating) {
  let ratingArray = [];
  if(rating) {
    const roundedRating = Math.round(rating)
    ratingArray = [false, false, false, false, false];
    for(let i = 0; i < roundedRating; i++) {
      ratingArray[i] = true;
    }
  }

  return ratingArray
}

// GET /movies/:id Retrieves a specific movie
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  const movieData = await movieDAO.getMovie(id);
  const avgArray = await reviewDAO.getAvgRatingByMovieId(id);
  const avgRating = (avgArray && avgArray.length > 0) ? avgArray[0].averageRating : 0

  let reviews = await reviewDAO.findAllByMovieId(id);
  res.render("movie", {
    // Single movie object from database
    "movieData": movieData,
    // Average rating toFixed(1)
    "avgRating": avgRating,
    // An array of review objects
    "reviews": reviews,
    // The length of reviews array (integer)
    "numReviews": reviews.length,
    // The first item from the reviews array
    "firstReview": reviews[0],
    // Boolean array with length of 5 for the first review
    // 3.2 = [true, true, true, false, false]
    "firstReviewStarRating":  (reviews && reviews.length > 0) ? convertStarRating(reviews[0].rating) : null,
    // Boolean array for average rating
    "userStarRating": avgRating
  })
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
