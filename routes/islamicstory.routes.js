const express = require("express");
const router = express.Router();
const { getIslamicStory,getIslamicStorybyStoryID,CreateIslamicStory,UpdateIslamicStory,DeleteIslamicStory } = require("../controllers/islamicstory.controller");

router.route("/").get(getIslamicStory).get(getIslamicStorybyStoryID).post(CreateIslamicStory);
router.route("/:id").put(UpdateIslamicStory);
router.route("/:id").delete(DeleteIslamicStory);
module.exports = router;