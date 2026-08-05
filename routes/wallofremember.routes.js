const express = require("express");
const router = express.Router();
const { getWallOfRemember } = require("../controllers/wallofremember.controller");

router.route("/").get(getWallOfRemember);

module.exports = router;