const router = require("express").Router();
const postReport = require("../controllers/report");
const cookieAuth  = require("../middleware/cookieAuth");

router.post("/report", cookieAuth, postReport);
module.exports = router;
