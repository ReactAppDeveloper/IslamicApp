const asyncHandler = require("express-async-handler");
const Tasbihs = require("../models/tasbihs");
const mongoose = require("mongoose");
//@desc Get all Hadees books
//@route GET /api/hadeesbooks
//@access private
const getTasbihs= asyncHandler(async (req, res) => {
  const tasbihs = await Tasbihs.find()
    .sort({ _id: 1 });
  res.status(200).json(tasbihs);
});

const getinTasbihs = asyncHandler(async (req, res) => {
  const tasbih = await Tasbihs.find(new mongoose.Types.ObjectId(req.params.id))
  res.status(200).json(tasbih);
});

const CreateTasbihs= asyncHandler(async (req, res) => {
  const {tasbihnameenglish} = req.body;
  const tasbih = await Tasbihs.create({
    tasbihnameenglish
  });
  res.status(200).json(tasbih);
});

const UpdateDuas = asyncHandler(async (req, res) => {
  const tasbih = {_id: req.params.id};
  Tasbihs.updateOne(tasbih,req.body)
  .then(tasbihid=>{
    if(!tasbihid){return res.status(404).end();}
    return res.status(200).json(tasbihid)
  })
});

const DeleteDuas = asyncHandler(async (req, res) => {
  Tasbihs.findByIdAndRemove(req.params.id)
 .exec()
 .then(tasbih=>{
  if(!tasbih){return res.status(404).end();}
  return  res.status(200).json({
    message: "Dua Deleted Successfully",
  });
 })
});

module.exports = {
    getTasbihs,
    CreateTasbihs,
    UpdateDuas,
    DeleteDuas,
    getinTasbihs
};