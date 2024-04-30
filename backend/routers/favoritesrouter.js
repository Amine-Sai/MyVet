const express = require("express");
const router = express.Router();
const {createFavorite, unfavorite} = require("../controllers/favorites");
const cookieAuth = require("../middleware/cookieAuth");

// Create a new favorite list
router.post("/favorite/product", cookieAuth, createFavorite);
router.post("/unfavorite/product", cookieAuth, unfavorite);

module.exports = router;
