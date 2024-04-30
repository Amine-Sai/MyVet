const router = require("express").Router();
const userPage = require("../controllers/userControl");

// user account
router.get("/account/:id", userPage);

module.exports = router;
// add user wish list and cart here @amro
