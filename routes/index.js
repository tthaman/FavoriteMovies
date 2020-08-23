const { Router } = require("express");
const router = Router();
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
  if(req.headers) {
    const {authorization} = req.headers;
    if (authorization) {
      const aToken = authorization.toString().split('Bearer ')[1]
      if (aToken && aToken !== "undefined") {
        try {
          const jwtToken = jwt.verify(aToken, process.env.SECRET);
          req.userEmail = jwtToken.email;
          req.userId = jwtToken.userId;
          req.roles = jwtToken.roles;
          next();
        } catch (e) {
          res.status(401).send(e.message);
        }
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

//before proceeding to the favorite route, make sure user has logged in.  All favorite routes require the userId
//to be in the request.
router.use('/favorite',(req, res, next) => {
  if(!req.userId) {
    res.status(401).send(e.message);
  } else {
    next();
  }
});

router.use("/login", require('./login'));
router.use("/favorite", require('./saved'));

module.exports = router;
