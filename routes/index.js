const { Router } = require("express");
const router = Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

router.use("/login", require('./login'));

router.get("/", (req, res, next) => {
  res.render('index');
})

router.get("/login/", (req, res, next) => {
  res.render('login');
})

router.get("/login/signup", (req, res, next) => {
  res.render('signup');
})

router.get("/login/logout", (req, res, next) => {
  res.render('login');
})

module.exports = router;