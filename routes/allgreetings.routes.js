const express = require("express");
const router = express.Router();
const { getAllGreetings } = require("../controllers/greeting.controller");

router.route("/").get(getAllGreetings);

module.exports = router;