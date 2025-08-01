const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const IslamicStory = require("../models/islamicstory.controller");

const getAllIslamicStory= asyncHandler(async (req, res) => {
  const allislamicstory = await IslamicStory.find()
    .sort({ id: 1 });
  res.status(200).json(allislamicstory);
});

const getIslamicStory = asyncHandler(async (req, res) => {
  if (req.query.title) {
    const islamicstoryname = await IslamicStory.find({
        title: req.query.title,
    });
    res.status(200).json(islamicstoryname);
    }
   else {
    res.status(200).json({
      message: "Please Enter title of Story",
    });
  }
});
const getStoryVersesbyID = asyncHandler(async (req, res) => {
  const islamicstoryverses = await IslamicStory.find(new mongoose.Types.ObjectId(req.params.id))
  res.status(200).json(islamicstoryverses);
});

const CreateIslamicStory= asyncHandler(async (req, res) => {
  const {title,path,categoryname,categoryId,storyId,language,shortdescription,longdescription,duration,reference,ratingvalue,audiourl} = req.body;
  const islamicstory = await IslamicStory.create({
    title,path,categoryname,categoryId,storyId,language,shortdescription,longdescription,duration,reference,ratingvalue,audiourl
  });
  res.status(200).json(islamicstory);
});

const UpdateIslamicStory = asyncHandler(async (req, res) => {
  const islamicstory = {_id: req.params.id};
  IslamicStory.updateOne(islamicstory,req.body)
  .then(islamicstoryid=>{
    if(!islamicstoryid){return res.status(404).end();}
    return res.status(200).json(islamicstoryid)
  })
});

const DeleteIslamicStory = asyncHandler(async (req, res) => {
  IslamicStory.findByIdAndRemove(req.params.id)
  .exec()
  .then(islamicstor=>{
   if(!islamicstor){return res.status(404).end();}
   return  res.status(200).json({
     message: "IslamicStory Deleted Successfully",
   });
  })
 });

module.exports = {
  getAllIslamicStory,
  getIslamicStory,
  getStoryVersesbyID,
  CreateIslamicStory,
  UpdateIslamicStory,
  DeleteIslamicStory
};
