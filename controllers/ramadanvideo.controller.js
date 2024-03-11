const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const RamadanVideo = require("../models/ramadanvideo");

//@desc Get all videos
//@route GET /api/videos
//@access private
const getRamadanVideos = asyncHandler(async (req, res) => {
    const ramadanvideos = await RamadanVideo.find()
      .skip(parseInt(req.query.start))
      .limit(parseInt(req.query.limit));
    res.status(200).json(ramadanvideos);
  });
  
module.exports = {
    getRamadanVideos,

};
