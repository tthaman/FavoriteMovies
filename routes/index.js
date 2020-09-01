const { Router } = require("express");
const router = Router();
const bodyParser = require('body-parser');
const movieDAO = require("../daos/movie");

router.use(bodyParser.urlencoded({ extended: true }));

router.use("/login", require('./login'));
router.use("/saved", require('./saved'));
router.use("/movie", require('./movie'));

router.get("/login/", (req, res, next) => {
  res.render('login');
})

router.get("/login/signup", (req, res, next) => {
  res.render('signup');
})

router.get("/login/logout", (req, res, next) => {
  res.render('login');
})

router.use("/", async (req, res, next) => {
  let { page } = req.query;
  page = page ? Number(page) : 1;
  const movies = await movieDAO.getAll(page);
  const pages = await movieDAO.getPages();
  res.render("index", {
    "movieArray": movies,
    "pages": pages
  });
});


module.exports = router;
