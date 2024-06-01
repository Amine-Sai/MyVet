const express = require("express");
const router = express.Router();
const cookieAuth = require("../middleware/cookieAuth");
const {
  updateEmail,
  updateFirstname,
  updateLastname,
  updatePic,
  updatePassword,
} = require("../controllers/setting");

router.post("/product/:productId", cookieAuth, addtoCart);