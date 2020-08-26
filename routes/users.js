const { Router } = require("express");
const router = Router();

const userDAO = require('../daos/user');
const { isAuthorized } = require('../middleware/middleware');
const { isAdmin } = require('../middleware/middleware');

router.get("/:id", isAuthorized, async (req, res, next) => {
  console.log(req.params.id);
  const user = await userDAO.getById(req.params.id);
  console.log(user);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
});

router.get("/", isAuthorized, async (req, res, next) => {
  const users = await userDAO.getAll();
  res.json(users);
});

router.put("/:id", isAuthorized, isAdmin, async (req, res, next) => {
  const userId = req.params.id;
  const user = req.body;
  if (!user || JSON.stringify(user) === '{}' ) {
    res.status(400).send('user is required"');
  } else {
    try {
      const success = await userDAO.updateById(userId, user);
      res.sendStatus(success ? 200 : 400);
    } catch(e) {
      if (e instanceof bookDAO.BadDataError) {
        res.status(400).send(e.message);
      } else {
        res.status(500).send(e.message);
      }
    }
  }
});

router.delete("/:id", isAuthorized, isAdmin, async (req, res, next) => {
  const userId = req.params.id;
  const success = await userDAO.deleteByUserId(userId);
  if (success) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
