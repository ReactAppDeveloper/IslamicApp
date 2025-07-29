const express = require("express");
const router = express.Router();
const { getIslSubCategory,createIslSubCategory } = require("../controllers/islsubcategory.controller");

router.route("/").get(getIslSubCategory).post(createIslSubCategory);

module.exports = router;