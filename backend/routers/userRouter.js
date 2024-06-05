const router = require("express").Router();
const {
  userPage,
  upgradeRequest,
  myArticles,
} = require("../controllers/userControl");
const cookieAuth = require("../middleware/cookieAuth");

// user account
router.get("/account/:userId", cookieAuth, userPage);
router.post("/account/upgraderequest", cookieAuth, upgradeRequest);
router.get("/articles", cookieAuth, myArticles);

module.exports = router;
