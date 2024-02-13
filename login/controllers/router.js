const express = require('express')
const router = express.Router()

const {
    createUser,
    userLogin
} = require('./control')

router.route('/login').post(userLogin)
router.route('/signup').post(createUser)

module.exports = router