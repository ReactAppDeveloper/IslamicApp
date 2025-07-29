const asyncHandler = require("express-async-handler");
const IslSubCategory = require("../models/islsubcategory");
const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;

const getAllIslSubCategory= asyncHandler(async (req, res) => {
  const allIslsubcategory = await IslSubCategory.find()
    .sort({ id: 1 });
  res.status(200).json(allIslsubcategory);
});

const getIslSubCategory = asyncHandler(async (req, res) => {
  const islsubcategory = await IslSubCategory.find({ categoryId: new mongoose.Types.ObjectId(req.query.categoryId) })
    .skip(parseInt(req.query.start))
    .limit(parseInt(req.query.limit));
  res.status(200).json(islsubcategory);
});

const createIslSubCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.body;
  if (!categoryId) {
    res.status(400);
    throw new Error("categoryId is mandatory !");
  }
  if (req.files?.images?.length > 0) {
    await req.files?.images?.forEach(async file => {

      const image = await cloudinary.uploader.upload(`./uploads/${file.name}`);
      // file.mv("./uploads/" + file.name);
      const greeting = await IslSubCategory.create({
        categoryId: new mongoose.Types.ObjectId(categoryId),
        path: image.secure_url
      });
    });
    
    res.status(201).json({
      "message": "success"
    });
  }else{
    res.status(400);
    throw new Error("Image/Images is mandatory !");
  }

});

module.exports = {
  getAllIslSubCategory,
  getIslSubCategory,
  createIslSubCategory
};
