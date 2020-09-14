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
  const isNextPage = page + 1 < pages.length ? true : false;
  const isPrevPage = page - 1 !== 0 ? true : false;
  const nextPage = page + 1;
  const prevPage = page - 1;
  res.statusCode = 200;
  if(req.session.name) {
    res.render("index", {
      "movieArray": movies,
      "pages": pages,
      "currentPage": page,
      "isPrevPage": isPrevPage,
      "isNextPage": isNextPage,
      "nextPage": nextPage,
      "prevPage": prevPage,
      "name": req.session.name,
      "isLoggedIn": true,
      "showPagination": true,
    });
  } else {
    res.render("index", {
      "movieArray": movies,
      "pages": pages,
      "isPrevPage": isPrevPage,
      "isNextPage": isNextPage,
      "nextPage": nextPage,
      "prevPage": prevPage,
      "name": req.session.name,
      "currentPage": page,
      "showPagination": true,
    });
  }
});


module.exports = router;
