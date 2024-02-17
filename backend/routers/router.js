const express = require('express');
const router = express.Router();
const { createUser, userLogin } = require('../controllers/auth');
const { cookieAuth } = require('../auth/cookieAuth');

router.route('/login').post(userLogin)
// router.route('/add').post(cookieAuth)
router.route('/signup').post(createUser)

module.exports = router