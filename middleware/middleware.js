const tokenDAO = require('../daos/token');
const session = require('express-session');

module.exports = {}

// module.exports.isAuthorized = async (req, res, next) => {
//     const { authorization } = req.headers;
//     console.log(req.email)
//     if (authorization) {
//         const token = authorization.split(' ')[1];
//         if (token) {
//             req.token = token;
//             const email = await tokenDAO.getUser(token);
//             if (email) {
//                 req.email = email;
//                 next();
//             } else {
//                 res.render("signup", { message: true })
//             }
//         } else {
//                 res.render("signup", { message: true })
//         }
//     } else {
//             res.render("signup", { message: true })
//     }
// }

module.exports.isAuthorized = async (req, res, next) => {
        const token = req.session.token;
        if (token) {
            next();
        } else {
            res.status(401).render("login", { message: true })
        }
}

module.exports.isAdmin = (req, res, next) => {
    if (req.user.roles.includes('admin')) {
        next();
    } else {
        res.sendStatus(403);
    }
}
