const express = require("express");
const router = express.Router();
const { getindTranslatorAudio } = require("../controllers/translatoraudio.controller");
router.route("/:id").get(getindTranslatorAudio);
module.exports = router;
