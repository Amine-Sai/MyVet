const router = require("express").Router();
const {
  createProduct,
  getProduct,
  searchFilter,
  updateProduct,
  delProduct,
} = require("../controllers/productControl");
const cookieAuth = require("../middleware/cookieAuth");

// create a product
router.post("/:sellerId", cookieAuth, createProduct);

// search & filter
router.get("/search", searchFilter);

// load product page
router.get("/product/:productId", getProduct);

//update a single product
router.put("/product/:productId", cookieAuth, updateProduct);

//delete a single product
router.delete("/product/:productId", cookieAuth, delProduct);

module.exports = router;
