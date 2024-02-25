const router = require('express').Router();
const { createUser, userLogin } = require('../controllers/auth');
const cookieAuth = require('../middleware/cookieAuth');
const {userValidator} = require('../middleware/validator')


router.post('/login', (req, res) => userLogin(req,res));
router.post('/register', userValidator, (req, res) => createUser(req,res));

module.exports = router;