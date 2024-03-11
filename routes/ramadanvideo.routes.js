const express = require("express");
const router = express.Router();
const { getRamadanVideos } = require("../controllers/ramadanvideo.controller");

router.route("/").get(getRamadanVideos);

module.exports = router;