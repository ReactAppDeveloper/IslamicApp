const express = require("express");
const router = express.Router();
const { getStoryVersesbyID } = require("../controllers/islamicstory.controller");
router.route("/:id").get(getStoryVersesbyID);
module.exports = router;
