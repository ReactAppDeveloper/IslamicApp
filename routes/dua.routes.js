const express = require("express");
const router = express.Router();
const { getDuas } = require("../controllers/duas.controller");

router.route("/").get(getDuas);

module.exports = router;