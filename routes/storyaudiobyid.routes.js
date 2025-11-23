const express = require("express");
const router = express.Router();
const { getStoryAudiobyID } = require("../controllers/storiesaudios.controller");
router.route("/:id").get(getStoryAudiobyID);
module.exports = router;

