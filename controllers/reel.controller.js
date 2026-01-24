const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Reel = require("../models/reel");

const getAllReel= asyncHandler(async (req, res) => {
  const allreel = await Reel.find()
    .sort({ _id: 1 });
  res.status(200).json(allreel);
});
const CreateReel= asyncHandler(async (req, res) => {
  const {url} = req.body;
  const reel = await Reel.create({
    url
  });
  res.status(200).json(reel);
});
const getreelbyid = asyncHandler(async (req, res) => {
  const reel = await Reel.find(new mongoose.Types.ObjectId(req.params.id))
  res.status(200).json(reel);
});
const UpdateReel = asyncHandler(async (req, res) => {
  const reel = {_id: req.params.id};
  Reel.updateOne(reel,req.body)
  .then(reelid=>{
    if(!reelid){return res.status(404).end();}
    return res.status(200).json(reelid)
  })
});
const DeleteReel = asyncHandler(async (req, res) => {
  Reel.findByIdAndRemove(req.params.id)
  .exec()
  .then(reel=>{
   if(!reel){return res.status(404).end();}
   return  res.status(200).json({
     message: "Reel Deleted Successfully",
   });
  })
 });

module.exports = {
  getAllReel,
  getreelbyid,
  CreateReel,
  UpdateReel,
  DeleteReel
};
