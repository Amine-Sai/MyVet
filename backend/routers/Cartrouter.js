const express = require("express");
const router = express.Router();
const {
  getCart,
  addtoCart,
  removeProduct,
  BuyproductofCart,
} = require("../controllers/Cart");
const cookieAuth = require("../middleware/cookieAuth");

router.post("/product/:productId", cookieAuth, addtoCart);
router.get("/Cart", cookieAuth, getCart);
router.delete("/Cart/:productId", cookieAuth, removeProduct);
router.post("/Cart/buy", cookieAuth, BuyproductofCart);
module.exports = router;
