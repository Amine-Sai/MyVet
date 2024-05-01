const express = require("express");
const router = express.Router();
const toggleFavorite = require("../controllers/favorites");
const cookieAuth = require("../middleware/cookieAuth");

// Create a new favorite list
router.post("/product?:action", cookieAuth, toggleFavorite);

module.exports = router;