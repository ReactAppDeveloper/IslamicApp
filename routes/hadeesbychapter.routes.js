const express = require("express");
const router = express.Router();
const { getHadeesbychapters } = require("../controllers/hadeesbychapter.controller");

router.route("/").get(getHadeesbychapters);

module.exports = router;