const asyncHandler = require("express-async-handler");
const Speaker = require("../models/speaker");

//@desc Get all speakers
//@route GET /api/speakers
//@access private
const getSpeakers = asyncHandler(async (req, res) => {
  const speakers = await Speaker.find()
    .skip(parseInt(req.query.start))
    .limit(parseInt(req.query.limit));
  res.status(200).json(speakers);
});

//@desc Create New speaker
//@route POST /api/speakers
//@access private
const createSpeaker = asyncHandler(async (req, res) => {
  const { speakerName } = req.body;
  if (!speakerName) {
    res.status(400);
    throw new Error("speakerName is mandatory !");
  }
  if(req.files){
    let coverImage = req.files.coverImage;

    coverImage.mv('./uploads/' + coverImage.name);
  }
  const speaker = await Speaker.create({
    speakerName,
    ...(req.files && { coverImage: './uploads/' + req.files.coverImage.name }),
  });

  res.status(201).json(speaker);
});

module.exports = {
  getSpeakers,
  createSpeaker
};
