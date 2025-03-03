const express = require("express");
const router = express.Router();
const { getHomeDuas } = require("../controllers/homedua.controller");

router.route("/").get(getHomeDuas);

module.exports = router;