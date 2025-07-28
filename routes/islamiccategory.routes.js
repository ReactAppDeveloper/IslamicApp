const express = require("express");
const router = express.Router();
const { getIslamicCategory,CreateIslamicCategory,UpdateIslamicCategory,DeleteIslamicCategory} = require("../controllers/islamiccategory.controller");
router.route("/").get(getIslamicCategory).post(CreateIslamicCategory);
router.route("/:id").put(UpdateIslamicCategory);
router.route("/:id").delete(DeleteIslamicCategory);
module.exports = router;