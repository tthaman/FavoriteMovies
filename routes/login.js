const { Router } = require("express");
const router = Router();
const bcrypt = require('bcrypt');
const session = require('express-session')


const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');
const { isAuthorized } = require('../middleware/middleware');

router.post("/signup", async (req, res, next) => {
    const userData = req.body;
    if (!userData.password || userData.password === "") {
        res.status(400).send('Please provide a password');
    } else {
        try {
            const newUser = await userDAO.create(userData);
            if (newUser) {
                res.redirect("/login");
            } else {
                res.sendStatus(409);
            }
        } catch(e) {
            res.sendStatus(409);
        }
    }
})

router.post("/", async (req, res, next) => {
    const { email, password } = req.body;
    if (!password || password === "") {
        res.status(400).send('Please provide a password');
    } else {
        const savedUser = await userDAO.getByEmail(email);
        if (savedUser) {
            const passwordsMatch = await bcrypt.compare(password, savedUser.password);
            if (passwordsMatch) {
                if (savedUser) {
                    const token = await tokenDAO.create(email, password);
                    const oneHour = 3600000;
                    req.session.token = token;
                    req.session.cookie.maxAge = oneHour;
                    req.session.name = savedUser.firstName;
                    res.redirect('/');
                } else {
                    res.sendStatus(401);
                }
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    }
})

// router.post("/password", isAuthorized, async (req, res, next) => {
//     const { password } = req.body;
//     if (!password || password === "") {
//         res.status(400).send('Please provide a password');
//     } else {
//         const newPassword = await userDAO.updateUserPassword(req.token, password);
//         if (newPassword) {
//             res.sendStatus(200);
//         } else {
//             res.sendStatus(401);
//         }
//     }
// })

router.get("/logout", isAuthorized, async (req, res, next) => {
    req.session.destroy(function(err) {
        res.render('login');
      })
})

module.exports = router;
