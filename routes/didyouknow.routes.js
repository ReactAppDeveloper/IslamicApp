const express = require("express");
const router = express.Router();
const { getDidYouKnows } = require("../controllers/didyouknow.controller");

router.route("/").get(getDidYouKnows);

module.exports = router;