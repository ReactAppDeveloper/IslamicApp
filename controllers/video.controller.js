const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Video = require("../models/video");

//@desc Get all videos
//@route GET /api/videos
//@access private
const getVideos = asyncHandler(async (req, res) => {
  if(req.query.speakerId){
    const videos = await Video.find({ speakerId: new mongoose.Types.ObjectId(req.query.speakerId) })
      .skip(parseInt(req.query.start))
      .limit(parseInt(req.query.limit));
    if(!videos){
      res.status(404);
      throw new Error("Video not found");
    }
    res.status(200).json(videos);
  }else{
    const videos = await Video.find()
      .skip(parseInt(req.query.start))
      .limit(parseInt(req.query.limit));
    res.status(200).json(videos);
  }
});

//@desc Create New video
//@route POST /api/videos
//@access private
const createVideo = asyncHandler(async (req, res) => {
  const { videoTitle, videoLink, summary, speakerId } = req.body;
  if (!videoTitle || !videoLink || !speakerId) {
    res.status(400);
    throw new Error("mandatory fields missing!");
  }
  if (req.files) {
    let thumbnail = req.files.thumbnail;

    thumbnail.mv("./uploads/" + thumbnail.name);
  }
  const video = await Video.create({
    videoTitle,
    videoLink,
    ...(summary && { summary }),
    speakerId: new mongoose.Types.ObjectId(speakerId),
    ...(req.files && { thumbnail: "./uploads/" + req.files.thumbnail.name }),
  });

  res.status(201).json(video);
});

//@desc Get video
//@route GET /api/videos/:id
//@access private
const getVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  console.log(video, 'video')
  if (!video) {
    res.status(404);
    throw new Error("Video not found");
  }
  res.status(200).json(video);
});

module.exports = {
  getVideos,
  createVideo,
  getVideo
};
