const express = require("express");
const router = express.Router();
const { getSpeakers, createSpeaker } = require("../controllers/speaker.controller");

router.route("/").get(getSpeakers).post(createSpeaker);

module.exports = router;