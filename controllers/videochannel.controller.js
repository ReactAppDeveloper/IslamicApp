const asyncHandler = require("express-async-handler");
const Videochannel = require("../models/videochannel");
//@desc Get all Hadees books
//@route GET /api/hadeesbooks
//@access private
const getVideochannels= asyncHandler(async (req, res) => {
  const videochannels = await Videochannel.find()
    .sort({ id: 1 });
  res.status(200).json(videochannels);
});

module.exports = {
    getVideochannels,

};