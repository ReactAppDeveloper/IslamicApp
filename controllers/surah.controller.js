const asyncHandler = require("express-async-handler");
const Surah = require("../models/surah");

const getSurahs = asyncHandler(async (req, res) => {
  const surahs = await Surah.find()
    .sort({ _id: 1 });
  res.status(200).json(surahs);
});

module.exports = {
  getSurahs,
};
