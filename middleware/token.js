const jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
    try {
        jwt.verify(req.session.token, process.env.SECRET_KEY)
    } catch (error) {
        req.session.destroy(() => {
            res.redirect('/login')
        })
    }
next()
}