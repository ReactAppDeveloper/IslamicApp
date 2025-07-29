const express = require("express");
const router = express.Router();
const {getAllIslSubCategory ,getIslSubCategory,createIslSubCategory } = require("../controllers/islsubcategory.controller");

router.route("/").get(getAllIslSubCategory).get(getIslSubCategory).post(createIslSubCategory);

module.exports = router;