const { Router } = require("express");
const router = Router();
const bodyParser = require('body-parser');
const movieDAO = require("../daos/movie");
const session = require('express-session');
require('dotenv').config()


router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

router.use("/login", require('./login'));
router.use("/saved", require('./saved'));
router.use("/movie", require('./movie'));
router.use("/reviews", require('./review'));

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
  if(req.session.name) {
    res.render("index", {
      "movieArray": movies,
      "pages": pages,
      "currentPage": page,
      "name": req.session.name,
      "isLoggedIn": true
    });
  } else {
    res.render("index", {
      "movieArray": movies,
      "pages": pages,
      "currentPage": page
    });
  }
});


module.exports = router;
