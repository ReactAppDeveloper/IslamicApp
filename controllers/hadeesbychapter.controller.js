const asyncHandler = require("express-async-handler");
const Hadeesbychapter = require("../models/hadeesbychapter");

//@desc Get all chapters by book name and chapter id
//@route GET /api/hadiths?book=sahih-bukhair&chapter=1
//@access private
const getHadeesbychapters = asyncHandler(async (req, res) => {
 
  if (req.query.bookSlug,req.query.chapterId) {
    const hadeesbookchapters = await Hadeesbychapter.find({
      bookSlug: req.query.bookSlug,
      chapterId: req.query.chapterId,
    }).sort({ id: 1 });
    res.status(200).json(hadeesbookchapters);
  }
   else {
    res.status(200).json({
      message: "Please enter Book Name and Chapter Id",
    });
  }
});

module.exports = {
    getHadeesbychapters,
};
