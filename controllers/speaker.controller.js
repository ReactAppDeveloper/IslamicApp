const asyncHandler = require("express-async-handler");
const Speaker = require("../models/speaker");


const getSpeakers = asyncHandler(async (req, res) => {
  const speakers = await Speaker.find()
   .sort({ _id: 1 });
  res.status(200).json(speakers);
});

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
