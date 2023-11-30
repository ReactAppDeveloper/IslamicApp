const express = require("express");
const router = express.Router();
const { getDuas, CreateDuas, UpdateDuas, DeleteDuas } = require("../controllers/duas.controller");

router.route("/").get(getDuas).post(CreateDuas);
router.route("/:id").put(UpdateDuas);
router.route("/:id").delete(DeleteDuas);
module.exports = router;