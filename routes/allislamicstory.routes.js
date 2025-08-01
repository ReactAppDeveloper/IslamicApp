const express = require("express");
const router = express.Router();
const { getAllIslamicStory} = require("../controllers/islamicstory.controller");

router.route("/").get(getAllIslamicStory);
module.exports = router;
