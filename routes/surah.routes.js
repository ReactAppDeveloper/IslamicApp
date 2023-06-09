const express = require("express");
const router = express.Router();
const { getSurahs } = require("../controllers/surah.controller");

router.route("/").get(getSurahs);

module.exports = router;