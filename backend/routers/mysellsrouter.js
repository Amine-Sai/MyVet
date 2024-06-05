const express = require("express");
const router = express.Router();
const { getMySells } = require("../controllers/orderscontroller");
const cookieAuth = require("../middleware/cookieAuth");

router.get("/mysells", cookieAuth, getMySells);

module.exports = router;
