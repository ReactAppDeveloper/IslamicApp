const express = require("express");
const router = express.Router();
const { getinTasbihs } = require("../controllers/tasbihs.controller");
router.route("/:id").get(getinTasbihs);
module.exports = router;