const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const HomeDua = require("../models/homedua");

//@desc Get all videos
//@route GET /api/videos
//@access private
const getHomeDuas = asyncHandler(async (req, res) => {
    const homeduas = await HomeDua.find()
      .skip(parseInt(req.query.start))
      .limit(parseInt(req.query.limit));
    res.status(200).json(homeduas);
  });
  
module.exports = {
    getHomeDuas,
};
