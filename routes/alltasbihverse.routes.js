const express = require("express");
const router = express.Router();
const { getAllTasbihsVerses} = require("../controllers/tasbihverses.controller");

router.route("/").get(getAllTasbihsVerses);
module.exports = router;