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

router.post("/logout", async (req, res, next) => {
    if (req.headers.authorization) {
        delete req.headers.authorization;
    }
    if (req.user) {
        delete req.user;
    }
    res.statusCode = 200;
    res.send();
    // res.render('weather', {
    //     name: 'Other',
    //     temperature: 'not available'
    // })
});

router.post("/", async (req, res, next) => {
    const { email, password } = req.body;
    if (!password || password === "") {
        res.status(400).send('Please provide a password');
    } else {
        let savedUser = await userDAO.getByEmail(email);
        if (savedUser) {
            const passwordsMatch = bcrypt.compareSync(password, savedUser.password);
            if (passwordsMatch) {
                try {
                    let tokenData = (({ _id, email, roles, firstName, lastName }) => (
                      { _id, email, roles, firstName, lastName }
                    ))(savedUser);
                    tokenData['userId'] = tokenData['_id'];
                    const token = jwt.sign(tokenData, secret, { expiresIn: '5 minutes' })
                    res.json({ token });
                } catch (e) {
                    res.sendStatus(401);
                }
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    }
});

module.exports = router;
