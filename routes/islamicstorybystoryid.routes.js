const express = require("express");
const router = express.Router();
const { getIslamicStorybyStoryID} = require("../controllers/islamicstory.controller");

router.route("/").get(getIslamicStorybyStoryID);
module.exports = router;
