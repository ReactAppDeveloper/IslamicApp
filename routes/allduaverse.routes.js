const express = require("express");
const router = express.Router();
const { getAllDuasVerses} = require("../controllers/duaverses.controller");

router.route("/").get(getAllDuasVerses);
module.exports = router;