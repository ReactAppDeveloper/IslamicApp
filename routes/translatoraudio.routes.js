const express = require("express");
const router = express.Router();
const { getTranslatorAudio } = require("../controllers/translatoraudio.controller");
router.route("/").get(getTranslatorAudio);
module.exports = router;