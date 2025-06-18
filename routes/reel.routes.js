const express = require("express");
const router = express.Router();
const { getAllReel,CreateReel,UpdateReel,DeleteReel } = require("../controllers//reel.controller");

router.route("/").get(getAllReel).post(CreateReel);
router.route("/:id").put(UpdateReel);
router.route("/:id").delete(DeleteReel);
module.exports = router;