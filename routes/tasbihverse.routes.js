const express = require("express");
const router = express.Router();
const { getTasbhiverses,CreateTasbihsVerses,UpdateTasbihsVerses,DeleteTasbihsverses } = require("../controllers/tasbihverses.controller");

router.route("/").get(getTasbhiverses).post(CreateTasbihsVerses);
router.route("/:id").put(UpdateTasbihsVerses);
router.route("/:id").delete(DeleteTasbihsverses);
module.exports = router;