const router = require('express').Router()
const {cookieAuth } = require('../middleware/cookieAuth')
const {userPage,userSearch} = require('../controllers/userControl')

    // user account
router.get('/account/:id', cookieAuth, (req, res) => userPage)
router.post('/search', (req,res) => userSearch)

module.exports = router
    // add user wish list and cart here @amro