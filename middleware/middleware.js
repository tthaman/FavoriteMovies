const jwt = require('jsonwebtoken');
const secret = 'spongebob squarepants';

module.exports = {}

module.exports.isAuthorized = async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization.split(' ')[1];
        try {
            const user = jwt.verify(token, secret);
            if (user) {
                req.user = user;
                next();
            } else {
                res.sendStatus(401);
            }
        } catch (e) {
                res.sendStatus(401);
        }
    } else {
            res.sendStatus(401);
    }
}
module.exports.isAdmin = (req, res, next) => {
    if (req.user.roles.includes('admin')) {
        next();
    } else {
        res.sendStatus(403);
    }
}