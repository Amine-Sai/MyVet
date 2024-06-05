const express = require("express");
const router = express.Router();
const { getMySells } = require("../controllers/mysells");
const cookieAuth = require("../middleware/cookieAuth");

// Create a new favorite list
//router.post("/product/:productId", cookieAuth, toggleFavorite);
router.get("/mysells", cookieAuth,getMySells);

module.exports = router;
