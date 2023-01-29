const jwt = require('jsonwebtoken');
module.exports = function(req, res, next){
        res.locals.isAuth = req.session.isAuthenticated
        try {
            let token = jwt.verify(req.session.token, process.env.SECRET_KEY);
            res.locals.token = token;
        } catch (error) {
            console.log("Problem with token");
        }
    next()
}