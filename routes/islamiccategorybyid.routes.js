const express = require("express");
const router = express.Router();
const { getIslamicCategoryByID } = require("../controllers/islamiccategory.controller");
router.route("/:id").get(getIslamicCategoryByID);
module.exports = router;