const express = require("express");
const router = express.Router();
const { getreelbyid } = require("../controllers/reel.controller");
router.route("/:id").get(getreelbyid);
module.exports = router;