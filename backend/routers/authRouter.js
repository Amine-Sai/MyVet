const router = require("express").Router();
const { createUser, userLogin } = require("../controllers/auth");
const { userValidator } = require("../middleware/validator");
const errorHandlerMiddleware = require("../middleware/error-handler");

router.post("/login", userLogin);
router.post("/register", userValidator, errorHandlerMiddleware, createUser);

module.exports = router;
