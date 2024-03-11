const express = require("express");
const router = express.Router();
const { getRamadanDatas } = require("../controllers/ramadandata.controller");

router.route("/").get(getRamadanDatas);

module.exports = router;