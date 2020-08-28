const tokenDAO = require('../daos/token');

module.exports = {}

module.exports.isAuthorized = async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization.split(' ')[1];
        if (token) {
            req.token = token;
            const email = await tokenDAO.getUser(token);
            if (email) {
                req.email = email;
                next();
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

module.exports.isAdmin = (req, res, next) => {
    if (req.user.roles.includes('admin')) {
        next();
    } else {
        res.sendStatus(403);
    }
}
