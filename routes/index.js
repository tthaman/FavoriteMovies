const { Router } = require("express");
const router = Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

router.use("/login", require('./login'));
router.use("/saved", require('./login'));

module.exports = router;
