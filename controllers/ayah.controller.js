const asyncHandler = require("express-async-handler");
const Ayah = require("../models/ayah");

//@desc Get all ayahs
//@route GET /api/ayahs
//@access private
const getAyahs = asyncHandler(async (req, res) => {
  if (parseInt(req.query.surah_id)) {
    const ayahs = await Ayah.find({
      surah__number: parseInt(req.query.surah_id),
    }).sort({ ayah__id: 1 });
    res.status(200).json(ayahs);
  } 
 else if (parseInt(req.query.juz_id)) {
    const ayahs = await Ayah.find({
      juz__number: parseInt(req.query.juz_id),
    }).sort({ ayah__id: 1 });
    res.status(200).json(ayahs);
  }
  else if (parseInt(req.query.page_number)) {
    const ayahs = await Ayah.find({
      page_number: parseInt(req.query.page_number),
    }).sort({ ayah__id: 1 });
    res.status(200).json(ayahs);
  } else {
    res.status(200).json({
      message: "Please either enter surah_id, juz_id or page_number",
    });
  }
});

module.exports = {
  getAyahs,
};
