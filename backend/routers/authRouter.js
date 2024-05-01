const router = require("express").Router();
const { createUser, userLogin, userLogout } = require("../controllers/auth");
const { userValidator } = require("../middleware/validator");

router.post("/login", userLogin);
router.post("/register", createUser);
router.post("/logout", userValidator, userLogout);

module.exports = router;
