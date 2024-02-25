const router = require('express').Router()
const {cookieAuth } = require('../middleware/cookieAuth')
const {userPage} = require('../controllers/userControl')

    // user account
router.get('/account/:id', cookieAuth, (req, res) => userPage)


    // add user wish list and cart here @amro