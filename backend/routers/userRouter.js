const router = require("express").Router();
const {userPage, upgradeRequest} = require("../controllers/userControl");
const cookieAuth = require("../middleware/cookieAuth");

// user account
router.get("/account/:userId", userPage);
router.post('/account/:userId',cookieAuth, upgradeRequest)

module.exports = router;
// add user wish list and cart here @amro
