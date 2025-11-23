const express = require("express");
const router = express.Router();
const { getIslamicStoryAudios } = require("../controllers/storiesaudios.controller");

router.route("/").get(getIslamicStoryAudios)

module.exports = router;
