const express = require("express");
const router = express.Router();
const { getDuaverses } = require("../controllers/duaverses.controller");

router.route("/").get(getDuaverses);

module.exports = router;