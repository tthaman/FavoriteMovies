const { Router } = require("express");
const router = Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

router.use("/login", require('./login'));
router.use("/users", require('./users'));

module.exports = router;