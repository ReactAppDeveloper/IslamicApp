const express = require("express");
const router = express.Router();
const { getIslamicStoryAudiobyStoryID} = require("../controllers/storiesaudios.controller");
router.route("/").get(getIslamicStoryAudiobyStoryID);
module.exports = router;

