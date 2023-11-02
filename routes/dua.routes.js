const express = require("express");
const router = express.Router();
const { getDuas,getindDuas, CreateDuas, UpdateDuas, DeleteDuas } = require("../controllers/duas.controller");

router.route("/").get(getDuas).post(CreateDuas);
router.route("/").post(getindDuas);
router.route("/:id").put(UpdateDuas);
router.route("/:id").delete(DeleteDuas);
module.exports = router;