const express = require("express");
const router = express.Router();
const {
  getCart,
  addtoCart,
  removeFromCart ,
  BuyproductofCart,
} = require("../controllers/Cart");
const cookieAuth = require("../middleware/cookieAuth");

router.post("/cart/product/:productId", cookieAuth, addtoCart);
router.get("/Cart", cookieAuth, getCart);
router.delete("/Cart/:productId", cookieAuth, removeFromCart);
//router.post("/Cart/buy", cookieAuth, BuyproductofCart);
module.exports = router;
