const express = require("express");
const router = express.Router();
const { getHadeesbookchapters } = require("../controllers/hadeesbookchapter.controller");

router.route("/").get(getHadeesbookchapters);

module.exports = router;