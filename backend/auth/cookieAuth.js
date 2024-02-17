const jwt = require('jsonwebtoken')

exports.cookieAuth = (req,res,next) =>{
    const token = req.cookie.token
    try {
       const user = jwt.verify(token,process.env.JWT_TOKEN)
       req.user = user
    } catch (err) {
        res.clearCookie("jwt")
        return res.redirect("/login")
    }
}