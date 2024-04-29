const router = require('express').Router();
const { createUser, userLogin } = require('../controllers/auth');
const {userValidator} = require('../middleware/validator')


router.post('/login', userLogin(req,res));
router.post('/register', userValidator, createUser(req,res));

module.exports = router;