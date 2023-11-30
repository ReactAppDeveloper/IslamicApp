const express = require("express");
const router = express.Router();
const { getTasbihs,CreateTasbihs,UpdateDuas,DeleteDuas } = require("../controllers/tasbihs.controller");

router.route("/").get(getTasbihs).post(CreateTasbihs);
router.route("/:id").put(UpdateDuas);
router.route("/:id").delete(DeleteDuas);
module.exports = router;