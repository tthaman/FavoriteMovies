const { Router } = require("express");
const router = Router();

router.use("/login", require('./login'));
router.use("/users", require('./users'));
router.use("/movies", require('./movies'));
router.use("/saved", require('./saved'));


module.exports = router;