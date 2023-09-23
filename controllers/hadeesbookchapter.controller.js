const asyncHandler = require("express-async-handler");
const Hadeesbookchapter = require("../models/hadeesbookchapter");

//@desc Get all ayahs
//@route GET /api/ayahs
//@access private
const getHadeesbookchapters = asyncHandler(async (req, res) => {
 
  if (req.query.bookSlug) {
    const hadeesbookchapters = await Hadeesbookchapter.find({
      bookSlug: req.query.bookSlug,
    }).sort({ id: 1 });
    res.status(200).json(hadeesbookchapters);
  }
   else {
    res.status(200).json({
      message: "Please enter Book Name",
    });
  }
});

module.exports = {
  getHadeesbookchapters,
};
