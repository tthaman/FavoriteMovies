const { Router } = require("express");
const router = Router();

router.use("/login", require('./login'));
router.use("/users", require('./users'));

module.exports = router;