const express = require("express");
const router = express.Router();
const { getAllIslamicStoryAudios } = require("../controllers/storiesaudios.controller");

router.route("/").get(getAllIslamicStoryAudios);
module.exports = router;

