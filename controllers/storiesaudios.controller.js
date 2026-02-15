const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const StoriesAudios = require("../models/storiesaudios");

const getAllIslamicStoryAudios = asyncHandler(async (req, res) => {
  const allislamicstoryaudios = await StoriesAudios.find()
    .sort({ _id: 1 });
  res.status(200).json(allislamicstoryaudios);
});

const getIslamicStoryAudios = asyncHandler(async (req, res) => {
  if (req.query.title) {
    const islamicstoryaudioname = await StoriesAudios.find({
        title: req.query.title,
    });
    res.status(200).json(islamicstoryaudioname);
    }
   else {
    res.status(200).json({
      message: "Please Enter title of Story Audio",
    });
  }
});
const getIslamicStoryAudiobyStoryID = asyncHandler(async (req, res) => {
  const islstoryaudio = await StoriesAudios.find({ storyId: new mongoose.Types.ObjectId(req.query.storyId) })
   .sort({ _id: 1 });
  res.status(200).json(islstoryaudio);
});

const getStoryAudiobyID = asyncHandler(async (req, res) => {
  const islamicstoryaudio = await StoriesAudios.find(new mongoose.Types.ObjectId(req.params.id))
  res.status(200).json(islamicstoryaudio);
});



module.exports = {
  getAllIslamicStoryAudios,
  getIslamicStoryAudios,
  getIslamicStoryAudiobyStoryID,
  getStoryAudiobyID
};
