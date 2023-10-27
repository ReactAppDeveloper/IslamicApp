const express = require("express");
const router = express.Router();
const { getVideochannels } = require("../controllers/videochannel.controller");

router.route("/").get(getVideochannels);

module.exports = router;