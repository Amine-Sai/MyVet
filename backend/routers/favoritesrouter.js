const express = require("express");
const router = express.Router();
const {toggleFavorite, getFavorites} = require("../controllers/favorites");
const cookieAuth = require("../middleware/cookieAuth");

// Create a new favorite list
router.post("/product/:productId", cookieAuth, toggleFavorite);
router.get("/favorites",cookieAuth, getFavorites)

module.exports = router;
