const express = require("express");
const router = express.Router();
const { getindDuaCategoires } = require("../controllers/duacategory.controller");
router.route("/:id").get(getindDuaCategoires);
module.exports = router;