const asyncHandler = require("express-async-handler");
const Greeting = require("../models/greeting");
const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;

//@desc Get all greetings
//@route GET /api/greetings
//@access private
const getGreetings = asyncHandler(async (req, res) => {
  const greetings = await Greeting.find({ categoryId: new mongoose.Types.ObjectId(req.query.categoryId) })
    .skip(parseInt(req.query.start))
    .limit(parseInt(req.query.limit));
  res.status(200).json(greetings);
});

//@desc Create New greeting
//@route POST /api/greetings
//@access private
const createGreetings = asyncHandler(async (req, res) => {
  const { categoryId } = req.body;
  if (!categoryId) {
    res.status(400);
    throw new Error("categoryId is mandatory !");
  }
  if (req.files?.images?.length > 0) {
    await req.files?.images?.forEach(async file => {

      const image = await cloudinary.uploader.upload(`./uploads/${file.name}`);
      // file.mv("./uploads/" + file.name);
      const greeting = await Greeting.create({
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

  // res.status(201).json(req.files?.images);
});

module.exports = {
  getGreetings,
  createGreetings
};
