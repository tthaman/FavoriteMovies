const { Router } = require("express");
const router = Router();
const bodyParser = require('body-parser');
const movieDAO = require("../daos/movie");

router.use(bodyParser.urlencoded({ extended: true }));

router.use("/login", require('./login'));
router.use("/saved", require('./saved'));
router.use("/movie", require('./movie'));

router.use("/", async (req, res, next) => {
  const movies = await movieDAO.getAll();
  res.render("index", {
    "movieArray": movies
  });
});


module.exports = router;
