const express = require("express");
const router = express.Router();
const { getmyOrders } = require("../controllers/orderscontroller");
const cookieAuth = require("../middleware/cookieAuth");

// Create a new favorite list
//router.post("/product/:productId", cookieAuth, toggleFavorite);
router.get("/myorders", cookieAuth, getmyOrders);

module.exports = router;
