const express = require("express");
const router = express.Router();
const { getQuranPages } = require("../controllers/quranpage.controller");

router.route("/").get(getQuranPages);

module.exports = router;