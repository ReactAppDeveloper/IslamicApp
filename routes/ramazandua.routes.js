const express = require("express");
const router = express.Router();
const { getRamazanDuas } = require("../controllers/ramazandua.controller");

router.route("/").get(getRamazanDuas);

module.exports = router;