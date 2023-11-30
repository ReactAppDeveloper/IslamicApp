const express = require("express");
const router = express.Router();
const { getTasbihs } = require("../controllers/tasbihs.controller");

router.route("/").get(getTasbihs);
module.exports = router;