const express = require("express");
const router = express.Router();
const { getTranslatorAudioByReciterID } = require("../controllers/translatoraudio.controller");

router.route("/").get(getTranslatorAudioByReciterID)
module.exports = router;
