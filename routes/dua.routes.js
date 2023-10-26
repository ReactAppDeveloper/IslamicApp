const express = require("express");
const router = express.Router();
const { getDuas, CreateDuas, UpdateDuas } = require("../controllers/duas.controller");

router.route("/").get(getDuas).post(CreateDuas);

module.exports = router;