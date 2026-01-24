const express = require("express");
const router = express.Router();
const { getDuaCategories,CreateDuaCategoires, UpdateDuaCategoires, DeleteDuaCategoires } = require("../controllers/duacategory.controller");

router.route("/").get(getDuaCategories).post(CreateDuaCategoires);
router.route("/:id").put(UpdateDuaCategoires);
router.route("/:id").delete(DeleteDuaCategoires);
module.exports = router;