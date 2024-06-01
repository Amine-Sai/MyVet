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

router.post("/Settings/update-email", cookieAuth,updateEmail);
router.post("/Settings/update-Firstname", cookieAuth,updateFirstname);
router.post("/Settings/update-Lastname", cookieAuth, updateLastname);
router.post("/Settings/update-Pic", cookieAuth, updatePic);
router.post("/Settings/update-Password", cookieAuth, updatePassword);
module.exports = router;