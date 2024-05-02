const router = require("express").Router();
const { createUser, userLogin, userLogout } = require("../controllers/auth");

router.post("/login", userLogin);
router.post("/register", createUser);
router.post("/logout", userLogout);

module.exports = router;
