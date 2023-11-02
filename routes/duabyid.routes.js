const express = require("express");
const router = express.Router();
const { getindDuas } = require("../controllers/duas.controller");
router.route("/:id").get(getindDuas);
module.exports = router;