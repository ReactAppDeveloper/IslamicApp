const express = require("express");
const router = express.Router();
const { getDuaverses,CreateDuasVerses,UpdateDuasVerses,DeleteDuasverse } = require("../controllers/duaverses.controller");

router.route("/").get(getDuaverses).post(CreateDuasVerses);
router.route("/:id").put(UpdateDuasVerses);
router.route("/:id").delete(DeleteDuasverse);
module.exports = router;