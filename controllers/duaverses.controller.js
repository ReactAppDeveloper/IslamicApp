const asyncHandler = require("express-async-handler");
const Duaverse = require("../models/duaverse");


//@desc Get all chapters by book name and chapter id
//@route GET /api/hadiths?book=sahih-bukhair&chapter=1
//@access private
const getDuaverses = asyncHandler(async (req, res) => {
 
  if (req.query.duanameenglish) {
    const duabookverses = await Duaverse.find({
        duanameenglish: req.query.duanameenglish,
    });
    res.status(200).json(duabookverses);
  }
   else {
    res.status(200).json({
      message: "Please Enter Dua Name",
    });
  }
});

module.exports = {
  getDuaverses,
};
