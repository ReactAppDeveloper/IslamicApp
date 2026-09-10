const express = require("express");
const router = express.Router();
const { getWallOfRememberByID } = require("../controllers/wallofremember.controller");
router.route("/:id").get(getWallOfRememberByID);
module.exports = router;