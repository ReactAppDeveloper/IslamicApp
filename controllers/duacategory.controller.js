const asyncHandler = require("express-async-handler");
const DuaCategories = require("../models/duacategories");
const mongoose = require("mongoose");

const getDuaCategories = asyncHandler(async (req, res) => {
  const duacategories = await DuaCategories.find()
    .sort({ _id: 1 });
  res.status(200).json(duacategories);
});
const getindDuaCategoires = asyncHandler(async (req, res) => {
  const duacategories = await DuaCategories.find(new mongoose.Types.ObjectId(req.params.id))
  res.status(200).json(duacategories);
});
const CreateDuaCategoires= asyncHandler(async (req, res) => {
  const {title,image} = req.body;
  const dua = await DuaCategories.create({
    title,image
  });
  res.status(200).json(dua);
});
const UpdateDuaCategoires = asyncHandler(async (req, res) => {
  const duacategories = {_id: req.params.id};
  DuaCategories.updateOne(duacategories,req.body)
  .then(duaid=>{
    if(!duaid){return res.status(404).end();}
    return res.status(200).json(duaid)
  })
});
const DeleteDuaCategoires = asyncHandler(async (req, res) => {
 DuaCategories.findByIdAndRemove(req.params.id)
 .exec()
 .then(dua=>{
  if(!dua){return res.status(404).end();}
  return  res.status(200).json({
    message: "Dua Deleted Successfully",
  });
 })
});
module.exports = {
  getDuaCategories,
  getindDuaCategoires,
  CreateDuaCategoires,
  UpdateDuaCategoires,
  DeleteDuaCategoires
};