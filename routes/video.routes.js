const express = require("express");
const router = express.Router();
const { getVideos, createVideo, getVideo } = require("../controllers/video.controller");

router.route("/").get(getVideos).post(createVideo);
router.route("/:id").get(getVideo);

module.exports = router;