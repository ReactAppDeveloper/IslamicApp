const express = require("express");
const router = express.Router();
const { getindTasbihsVerses } = require("../controllers/tasbihverses.controller");
router.route("/:id").get(getindTasbihsVerses);
module.exports = router;