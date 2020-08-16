const { Router } = require("express");
const router = Router();
const jwt = require('jsonwebtoken');
const secret = 'put this someplace else';



router.use((req, res, next) => {
  if(req.headers) {
    const {authorization} = req.headers;
    if (authorization) {
      const aToken = authorization.toString().split('Bearer ')[1]
      if (aToken && aToken !== "undefined") {
        try {
          const jwtToken = jwt.verify(aToken, secret)
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

router.use('/items',(req, res, next) => {
  if(!req.userId) {
    res.status(401).send(e.message);
  } else {
    next();
  }
});

router.use('/orders',(req, res, next) => {
  if(!req.userId) {
    res.status(401).send(e.message);
  } else {
    next();
  }
});

router.use("/login", require('./login'));
router.use("/items", require('./items'));
router.use("/orders", require('./orders'));

module.exports = router;
