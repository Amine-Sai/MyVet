const router = require("express").Router();
const {
  userPage,
  upgradeRequest,
  myArticles,
} = require("../controllers/userControl");
const cookieAuth = require("../middleware/cookieAuth");

// user account
router.get("/account/:userId", userPage);
router.post("/account/upgraderequest", cookieAuth, upgradeRequest);
router.get("/articles", cookieAuth, myArticles);

// add user wish list and cart here @amro

module.exports = router;
