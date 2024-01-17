const express = require("express");
const router = express.Router();
const { getAllDuasVerses,getDuaverses,CreateDuasVerses,UpdateDuasVerses,DeleteDuasverse } = require("../controllers/duaverses.controller");

router.route("/").get(getAllDuasVerses).get(getDuaverses).post(CreateDuasVerses);
router.route("/:id").put(UpdateDuasVerses);
router.route("/:id").delete(DeleteDuasverse);
module.exports = router;