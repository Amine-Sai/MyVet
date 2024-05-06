const router = require("express").Router();
const {
  createUser,
  userLogin,
  userLogout,
  resetPassword,
  passResetEmail,
} = require("../controllers/auth");
const reverseAuth = require("../middleware/reverseAuth");

router.post("/login", userLogin);
router.post("/register", createUser);
router.post("/password-reset-request", reverseAuth, passResetEmail);
router.post("/reset-password", reverseAuth, resetPassword);
router.post("/logout", userLogout);

module.exports = router;
