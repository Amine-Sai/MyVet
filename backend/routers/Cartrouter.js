const express = require("express");
const router = express.Router();
const {
  getCart,
  addtoCart,
  removeFromCart,
  buyFromCart,
} = require("../controllers/Cart");
const cookieAuth = require("../middleware/cookieAuth");

router.post("/cart/product/:productId", cookieAuth, addtoCart);
router.get("/cart", cookieAuth, getCart);
router.delete("/cart/:productId", cookieAuth, removeFromCart);
router.post("/cart/buy", cookieAuth, buyFromCart);
module.exports = router;