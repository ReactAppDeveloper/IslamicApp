const express = require("express");
const router = express.Router();
const {getAllIslSubCategory  } = require("../controllers/allislsubcategory.controller");

router.route("/").get(getAllIslSubCategory);

module.exports = router;