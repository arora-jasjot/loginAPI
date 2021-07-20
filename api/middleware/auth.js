const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.cookies.loginCookie;
        var verify = jwt.verify(token, "UserLoginToken");
        next();
    }
    catch(err){
        res.status(401).json({
            error: 'invalid token'
        })
    }
};