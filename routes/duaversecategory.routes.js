const express = require("express");
const router = express.Router();
const { getDuaVersesByCategoryID } = require("../controllers/duaverses.controller");

router.route("/").get(getDuaVersesByCategoryID)
module.exports = router;