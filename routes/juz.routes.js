const express = require("express");
const router = express.Router();
const { getJuzs } = require("../controllers/juz.controller");

router.route("/").get(getJuzs);

module.exports = router;