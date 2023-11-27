const express = require("express");
const router = express.Router();
const { getindDuasVerses } = require("../controllers/duaverses.controller");
router.route("/:id").get(getindDuasVerses);
module.exports = router;