const asyncHandler = require("express-async-handler");
const WudhuVideo = require("../models/wudhuvideo");

const getWudhuVideos= asyncHandler(async (req, res) => {
  const wudhuvideos = await WudhuVideo.find()
    .sort({ id: 1 });
  res.status(200).json(wudhuvideos);
});

module.exports = {
    getWudhuVideos,
};