const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Tasbhiverse = require("../models/tasbihs");

//@access private
const getAllTasbihsVerses= asyncHandler(async (req, res) => {
  const alltasbihsverses = await Tasbhiverse.find()
    .sort({ id: 1 });
  res.status(200).json(alltasbihsverses);
});
const getTasbhiverses = asyncHandler(async (req, res) => {
 
  if (req.query.tasbihnameenglish) {
    const tasbihbookverses = await Tasbhiverse.find({
      tasbihnameenglish: req.query.tasbihnameenglish,
    });
    res.status(200).json(tasbihbookverses);
  }
   else {
    res.status(200).json({
      message: "Please Enter Tasbih Name",
    });
  }
});
const getindTasbihsVerses = asyncHandler(async (req, res) => {
  const tasbihverse = await Tasbhiverse.find(new mongoose.Types.ObjectId(req.params.id))
  res.status(200).json(tasbihverse);
});
const CreateTasbihsVerses= asyncHandler(async (req, res) => {
  const {tasbihnameenglish,tasbihinarabic,tasbihtransliteration,tasbihpurpose} = req.body;
  const tasbih = await Tasbhiverse.create({
    tasbihnameenglish,tasbihinarabic,tasbihtransliteration,tasbihpurpose
  });
  res.status(200).json(tasbih);
});
const UpdateTasbihsVerses = asyncHandler(async (req, res) => {
  const tasbihverses = {_id: req.params.id};
  Tasbhiverse.updateOne(tasbihverses,req.body)
  .then(tasbihverseid=>{
    if(!tasbihverseid){return res.status(404).end();}
    return res.status(200).json(tasbihverseid)
  })
});
const DeleteTasbihsverses = asyncHandler(async (req, res) => {
  Tasbhiverse.findByIdAndRemove(req.params.id)
  .exec()
  .then(Tasbihverse=>{
   if(!Tasbihverse){return res.status(404).end();}
   return  res.status(200).json({
     message: "Tasbih Deleted Successfully",
   });
  })
 });

module.exports = {
  getAllTasbihsVerses,
  getTasbhiverses,
  CreateTasbihsVerses,
  UpdateTasbihsVerses,
  DeleteTasbihsverses,
  getindTasbihsVerses
};
