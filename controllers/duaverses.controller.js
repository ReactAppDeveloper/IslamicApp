const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
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
const getindDuasVerses = asyncHandler(async (req, res) => {
  const duaverse = await Duaverse.find(new mongoose.Types.ObjectId(req.params.id))
  res.status(200).json(duaverse);
});
const CreateDuasVerses= asyncHandler(async (req, res) => {
  const {duanameenglish,duafor,duainarabic,duatranslation,duatransliteration,duareferrence} = req.body;
  const dua = await Duaverse.create({
    duanameenglish,duafor,duainarabic,duatranslation,duatransliteration,duareferrence
  });
  res.status(200).json(dua);
});
const UpdateDuasVerses = asyncHandler(async (req, res) => {
  const duaverses = {_id: req.params.id};
  Duaverse.updateOne(duaverses,req.body)
  .then(duaverseid=>{
    if(!duaverseid){return res.status(404).end();}
    return res.status(200).json(duaverseid)
  })
});
const DeleteDuasverse = asyncHandler(async (req, res) => {
  Duaverse.findByIdAndRemove(req.params.id)
  .exec()
  .then(duaverse=>{
   if(!duaverse){return res.status(404).end();}
   return  res.status(200).json({
     message: "Dua Deleted Successfully",
   });
  })
 });

module.exports = {
  getDuaverses,
  CreateDuasVerses,
  UpdateDuasVerses,
  DeleteDuasverse,
  getindDuasVerses
};
