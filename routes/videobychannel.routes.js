const express = require("express");
const router = express.Router();
const { getChannel } = require("../controllers/video.controller");

router.route("/").get(getChannel);

module.exports = router;