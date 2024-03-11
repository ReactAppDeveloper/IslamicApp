const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const RamadanData = require("../models/ramadandata");

//@desc Get all videos
//@route GET /api/videos
//@access private
const getRamadanDatas = asyncHandler(async (req, res) => {
    const ramadandatas = await RamadanData.find()
      .skip(parseInt(req.query.start))
      .limit(parseInt(req.query.limit));
    res.status(200).json(ramadandatas);
  });
  
module.exports = {
    getRamadanDatas,
};
