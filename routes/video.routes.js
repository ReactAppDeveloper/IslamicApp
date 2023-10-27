const express = require("express");
const router = express.Router();
const { getVideos, createVideo, getVideo, getChannel } = require("../controllers/video.controller");

router.route("/").get(getVideos).post(createVideo);
router.route("/").get(getChannel);
router.route("/:id").get(getVideo);

module.exports = router;