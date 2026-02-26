const asyncHandler = require("express-async-handler");
const QuranPage = require("../models/quranpage");

const getQuranPages = asyncHandler(async (req, res) => {
  const quranPages = await QuranPage.find()
    .sort({ page: 1 });

  res.status(200).json(quranPages);
});

module.exports = {
  getQuranPages,
};