const express = require("express");
const router = express.Router();
const { getRamadanCalenders } = require("../controllers/ramadancalender.controller");

router.route("/").get(getRamadanCalenders);

module.exports = router;