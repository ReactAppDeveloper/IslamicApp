const asyncHandler = require("express-async-handler");
const Duas = require("../models/duas");
const mongoose = require("mongoose");
//@desc Get all Hadees books
//@route GET /api/hadeesbooks
//@access private
const getDuas= asyncHandler(async (req, res) => {
  const duas = await Duas.find()
    .sort({ id: 1 });
  res.status(200).json(duas);
});

const getindDuas = asyncHandler(async (req, res) => {
  const dua = await Duas.find(new mongoose.Types.ObjectId(req.params.id))
  res.status(200).json(dua);
});

const CreateDuas= asyncHandler(async (req, res) => {
  const {duanameenglish,duacontains} = req.body;
  const dua = await Duas.create({
    duanameenglish,duacontains
  });
  res.status(200).json(dua);
});
const UpdateDuas = asyncHandler(async (req, res) => {
  const dua = {_id: req.params.id};
  Duas.updateOne(dua,req.body)
  .then(duaid=>{
    if(!duaid){return res.status(404).end();}
    return res.status(200).json(duaid)
  })
});
const DeleteDuas = asyncHandler(async (req, res) => {
 Duas.findByIdAndRemove(req.params.id)
 .exec()
 .then(dua=>{
  if(!dua){return res.status(404).end();}
  return  res.status(200).json({
    message: "Dua Deleted Successfully",
  });
 })
});


module.exports = {
  getDuas,
  getindDuas,
  CreateDuas,
  UpdateDuas,
  DeleteDuas
};