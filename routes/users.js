// const { Router } = require("express");
// const router = Router();

// const userDAO = require('../daos/user');
// const { isAuthorized } = require('../middleware/middleware');
// const { isAdmin } = require('../middleware/middleware');

// router.get("/:id", async (req, res, next) => {
//   const userId = req.params.id;
//   console.log(userId);
//   const user = await userDAO.getById(userId);
//   if (user) {
//     res.json(user);
//   } else {
//     res.sendStatus(401);
//   }
// });

// router.get("/", async (req, res, next) => {
//     const users = await userDAO.getAll();
//     console.log(users);
//     res.json(users);
// });

// router.put("/:id", isAuthorized, isAdmin, async (req, res, next) => {
//   const { firstName, lastName } = req.body;
//   console.log(req.params.id);
//   const user = await userDAO.getById(req.params.id);
//   // if (user) {
//   //   const updatedUser = await userDAO.updateById(userId, firstName, lastName);
//   //   res.json(updatedUser);
//   // } else {
//   //   res.sendStatus(400);
//   // }
//     if (req.user.roles.includes('admin')) {
//         if (user) {
//             const updatedUser = await userDAO.updateById(userId, firstName, lastName);
//             res.json(updatedUser);
//         } else {
//             res.sendStatus(404);
//         }
//     } else {
//         const userId = req.user._id;
//         console.log(userId);
//         if (userId.toString() === req.params.id) {
//           const updatedUser = await userDAO.updateById(userId, user);
//           res.json(updatedUser);
//         } else {
//             res.sendStatus(401);
//         }
//     }
// })

// router.delete("/:id", isAuthorized, async (req, res, next) => {
//     const userId = req.params.id;
//     console.log(userId);
//     const success = await userDAO.deleteByUserId(userId);
//     if (success) {
//       res.sendStatus(200);
//     } else {
//       res.sendStatus(400);
//     }
// });

// module.exports = router;