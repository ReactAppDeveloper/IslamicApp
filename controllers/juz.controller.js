const asyncHandler = require("express-async-handler");
const Juz = require("../models/juz");

//@desc Get all surahs
//@route GET /api/surahs
//@access private
const getJuzs = asyncHandler(async (req, res) => {
  const juzs = await Juz.find()
    .sort({ id: 1 });
  res.status(200).json(juzs);
});

module.exports = {
  getJuzs,
};