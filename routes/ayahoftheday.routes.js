const express = require("express");
const router = express.Router();
const { getAyahOfTheDays } = require("../controllers/ayahoftheday.controller");

router.route("/").get(getAyahOfTheDays);

module.exports = router;