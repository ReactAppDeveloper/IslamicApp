const express = require("express");
const router = express.Router();
const { getGreetings, createGreetings } = require("../controllers/greeting.controller");

router.route("/").get(getGreetings).post(createGreetings);

module.exports = router;