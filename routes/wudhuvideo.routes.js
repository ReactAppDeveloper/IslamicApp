const express = require("express");
const router = express.Router();
const { getWudhuVideos } = require("../controllers/wudhuvideo.controller");

router.route("/").get(getWudhuVideos);

module.exports = router;