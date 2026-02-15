const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Video = require("../models/video");

const getVideos = asyncHandler(async (req, res) => {
  if(req.query.speakerId){
    const videos = await Video.find({ speakerId: new mongoose.Types.ObjectId(req.query.speakerId) })
     .sort({ _id: 1 });
    if(!videos){
      res.status(404);
      throw new Error("Video not found");
    }
    res.status(200).json(videos);
  }else{
    const videos = await Video.find()
     .sort({ _id: 1 });
    res.status(200).json(videos);
  }
});

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

const getVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  console.log(video, 'video')
  if (!video) {
    res.status(404);
    throw new Error("Video not found");
  }
  res.status(200).json(video);
});

const getChannel = asyncHandler(async (req, res) => {
 
  if (req.query.videochannelname) {
    const video = await Video.find({
      videochannelname: req.query.videochannelname,
    });
    res.status(200).json(video);
  }
   else {
    res.status(200).json({
      message: "Please Enter Video Channel Name",
    });
  }
});

module.exports = {
  getVideos,
  createVideo,
  getVideo,
  getChannel,
};
