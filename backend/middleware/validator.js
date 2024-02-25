const { body, validationResult } = require('express-validator')

exports.dataValidator = (req,res,next)=>{
    const err = validationResult(req)
    if(!err.isEmpty()) return res.status(400).json({errors: err.array()})

    next()
}   
exports.userValidator = (req,res,next) => {
    return validateUser = [
        body('email').isEmail().withMessage('Please enter a valid email address'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
      ]
}