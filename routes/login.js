const { Router } = require("express");
const router = Router();
const jwt = require('jsonwebtoken');
const secret = 'spongebob squarepants';
const bcrypt = require('bcrypt');

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');
const { isAuthorized } = require('../middleware/middleware');

router.post("/signup", async (req, res, next) => {
    const userData = req.body;
    if (!userData.password || userData.password === "") {
        res.status(400).send('Please provide a password');
    } else {
        const newUser = await userDAO.create(userData);
        if (newUser) {
            res.json(newUser);
        } else {
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
                    res.json(token);
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

router.post("/password", isAuthorized, async (req, res, next) => {
    const { password } = req.body;
    if (!password || password === "") {
        res.status(400).send('Please provide a password'); 
    } else {
        const newPassword = await userDAO.updateUserPassword(req.token, password);
        if (newPassword) {
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    }
})

router.post("/logout", isAuthorized, async (req, res, next) => {
    const success = await tokenDAO.delete(req.token);
        if (success) {
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
})

module.exports = router;
