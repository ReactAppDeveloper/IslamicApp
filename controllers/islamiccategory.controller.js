const asyncHandler = require("express-async-handler");
const IslamicCategory = require("../models/islamiccategory");
const mongoose = require("mongoose");

const getIslamicCategory = asyncHandler(async (req, res) => {
  const islamiccategory = await IslamicCategory.find()
    .sort({ id: 1 });
  res.status(200).json(islamiccategory);
});

const getIslamicCategoryByID = asyncHandler(async (req, res) => {
  const islamiccategory = await IslamicCategory.find(new mongoose.Types.ObjectId(req.params.id))
  res.status(200).json(islamiccategory);
});

const CreateIslamicCategory = asyncHandler(async (req, res) => {
  const {categoryname} = req.body;
  const islamiccategory = await IslamicCategory.create({
    categoryname
  });
  res.status(200).json(islamiccategory);
});

const UpdateIslamicCategory = asyncHandler(async (req, res) => {
  const islamiccategory = {_id: req.params.id};
  IslamicCategory.updateOne(islamiccategory,req.body)
  .then(islamiccategoryid=>{
    if(!islamiccategoryid){return res.status(404).end();}
    return res.status(200).json(islamiccategoryid)
  })
});

const DeleteIslamicCategory = asyncHandler(async (req, res) => {
 IslamicCategory.findByIdAndRemove(req.params.id)
 .exec()
 .then(islamiccategory=>{
  if(!islamiccategory){return res.status(404).end();}
  return  res.status(200).json({
    message: "Islamic Category Deleted Successfully",
  });
 })
});

module.exports = {
  getIslamicCategory,
  getIslamicCategoryByID,
  CreateIslamicCategory,
  UpdateIslamicCategory,
  DeleteIslamicCategory
};