const express = require("express");
const router = express.Router();
const { getRamadanTimes } = require("../controllers/ramadantime.controller");

router.route("/").get(getRamadanTimes);

module.exports = router;