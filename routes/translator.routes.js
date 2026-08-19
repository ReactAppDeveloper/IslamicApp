const express = require("express");
const router = express.Router();
const { getTranslator } = require("../controllers/translator.controller");

router.route("/").get(getTranslator);

module.exports = router;