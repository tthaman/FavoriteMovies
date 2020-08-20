const { Router } = require("express");
const router = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDAO = require('../daos/user');
const secret = 'put this someplace else';

// Signup
router.post("/signup", async (req, res, next) => {
  const {email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('user/password is required');
  } else {
    try {
      let savedUser = await userDAO.getByEmail(email);
      if(!savedUser ) {
        const user = await userDAO.create(req.body);
        res.json(user);
      } else {
        res.status(409).send('User already exists!');
      }
    } catch(e) {
      res.status(500).send(e.message);
    }
  }
});

// Password
router.post("/password", async (req, res, next) => {
  if (req.userEmail) {
    try {
      const {password} = req.body;
      if (!password) {
        res.status(400).send('password is required');
      } else {
        const updatedUser = await userDAO.updateUserPassword(req.userEmail, password)
        res.json(updatedUser);
      }
    } catch (e) {
      res.status(401).send(e.message);
    }
  } else {
    res.status(401).send('unauthorized');
  }
});


// Login
router.post("/", async (req, res, next) => {
  const {email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('user/password is required');
  } else {
    try {
      const savedUser = await userDAO.getByEmail(email);
      if(!savedUser){
        res.status(401).send(`User with email ${email} does not exist`);
      } else if (!bcrypt.compareSync(password, savedUser.password)) {
        res.status(401).send("Passwords do not match");
      }else {
        let tokenData = (({ _id, email, roles }) => ({ _id, email, roles }))(savedUser);
        tokenData['userId'] = tokenData['_id'];
        const token = jwt.sign(tokenData, secret, { expiresIn: '5 minutes' })
        res.body = {token: token};
        res.json(res.body);
      }
    } catch(e) {
      res.status(500).send(e.message);
    }
  }
});

module.exports = router;
