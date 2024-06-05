const router = require("express").Router();
const {
  createAdmin,
  updateProduct,
  deleteProduct,
  editHome,
  adminLogin,
  deleteUser,
  upgradeToSeller,
} = require("../controllers/admin");

const { getProduct, homePage } = require("../controllers/productControl");

const { searchFilter } = require("../controllers/productControl");
const adminAuth = require("../middleware/adminAuth");

//create admin
router.post(`/admin`, createAdmin);

// admin login
router.post(`/admin/login`, adminLogin);

/// USER MANAGEMENT
//delete user
router.delete("/account/:userId", adminAuth, deleteUser);

// upgrade to seller
router.put("/account/:userId", adminAuth, upgradeToSeller);

/// PRODUCT MANAGEMENT
// search & filter
router.get("/search", searchFilter);

// load product page
router.get("/product/:productId", getProduct);

//update a single product
router.put("/admin/product/:productId", adminAuth, updateProduct);

//delete a single product
router.delete("/product/:productId", adminAuth, deleteProduct);

// home page & update
router.get("/homepage", homePage);
router.post("/homepage", adminAuth, editHome);

// home page for flutter app
router.get("/home", searchFilter);
router.post("/homepage", adminAuth, editHome);

module.exports = router;
