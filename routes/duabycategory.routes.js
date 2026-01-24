const express = require("express");
const router = express.Router();
const { getDuasByCategoryID } = require("../controllers/duas.controller");

router.route("/").get(getDuasByCategoryID)
module.exports = router;