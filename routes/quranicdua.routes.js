const express = require("express");
const router = express.Router();
const { getQuranicDuas } = require("../controllers/quranicdua.controller");

router.route("/").get(getQuranicDuas);

module.exports = router;