const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const RamadanVideo = require("../models/ramadanvideo");

const getRamadanVideos = asyncHandler(async (req, res) => {
    const ramadanvideos = await RamadanVideo.find()
      .sort({ _id: 1 });
    res.status(200).json(ramadanvideos);
  });
  
module.exports = {
    getRamadanVideos,

};
