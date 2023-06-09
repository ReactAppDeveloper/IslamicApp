const express = require("express");
const router = express.Router();
const { getAyahs } = require("../controllers/ayah.controller");

router.route("/").get(getAyahs);

module.exports = router;