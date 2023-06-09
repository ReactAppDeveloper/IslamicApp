const asyncHandler = require("express-async-handler");
const Surah = require("../models/surah");

//@desc Get all surahs
//@route GET /api/surahs
//@access private
const getSurahs = asyncHandler(async (req, res) => {
  const surahs = await Surah.find()
    .sort({ id: 1 })
    .skip(parseInt(req.query.start))
    .limit(parseInt(req.query.limit));
  res.status(200).json(surahs);
});

module.exports = {
  getSurahs,
};
