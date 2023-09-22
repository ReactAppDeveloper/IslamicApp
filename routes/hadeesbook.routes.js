const express = require("express");
const router = express.Router();
const { getHadeesbooks } = require("../controllers/hadeesbooks.controller");

router.route("/").get(getHadeesbooks);

module.exports = router;