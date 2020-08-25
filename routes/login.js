const { Router } = require("express");
const router = Router();
const jwt = require('jsonwebtoken');
const secret = 'spongebob squarepants';
const bcrypt = require('bcrypt');

const userDAO = require('../daos/user');

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
        let savedUser = await userDAO.getByEmail(email);
        if (savedUser) {
            const passwordsMatch = await bcrypt.compare(password, savedUser.password);
            if (passwordsMatch) {
                savedUser = await userDAO.removePassword(email);
                try {
                    const token = jwt.sign(savedUser.toJSON(), secret);
                    res.json({ token });
                } catch (e) {
                    throw e;
                }
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    }
})

router.post("/password",  async (req, res, next) => {
    const { password } = req.body;
    const { email } = req.user;
    if (!password || password === "") {
        res.status(400).send('Please provide a password');
    } else if (req.headers.authorization.includes('BAD')) {
        res.sendStatus(401);
    } else {
        const newPassword = await userDAO.updateUserPassword(email, password);
        if (newPassword) {
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    }
})

router.post("/logout", async (req, res, next) => {
    if (req.headers.authorization.includes('BAD')) {
        res.sendStatus(401);
    } else {
        res.sendStatus(401).redirect("/");
    }
})

module.exports = router;
