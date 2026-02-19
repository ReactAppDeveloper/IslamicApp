const asyncHandler = require("express-async-handler");
const Duas = require("../models/duas");
const mongoose = require("mongoose");

const getDuas= asyncHandler(async (req, res) => {
  const duas = await Duas.find()
    .sort({ _id: 1 });
  res.status(200).json(duas);
});

const getDuasByCategoryID = asyncHandler(async (req, res) => {
  const duascategory = await Duas.find({ duacategoryId: new mongoose.Types.ObjectId(req.query.duacategoryId) })
    .sort({ _id: 1 });
  res.status(200).json(duascategory);
});

const getindDuas = asyncHandler(async (req, res) => {
  const dua = await Duas.find(new mongoose.Types.ObjectId(req.params.id))
  res.status(200).json(dua);
});

const CreateDuas= asyncHandler(async (req, res) => {
  const {duacategoryId,duanameenglish,duacontains} = req.body;
  const dua = await Duas.create({
    duacategoryId,duanameenglish,duacontains
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
  getDuasByCategoryID,
  getindDuas,
  CreateDuas,
  UpdateDuas,
  DeleteDuas
};