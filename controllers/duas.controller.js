const asyncHandler = require("express-async-handler");
const Duas = require("../models/duas");
//@desc Get all Hadees books
//@route GET /api/hadeesbooks
//@access private
const getDuas= asyncHandler(async (req, res) => {
  const duas = await Duas.find()
    .sort({ id: 1 });
  res.status(200).json(duas);
});

const CreateDuas= asyncHandler(async (req, res) => {
  const {duanameenglish,duacontains} = req.body;
  const dua = await Duas.create({
    duanameenglish,duacontains
  });
  res.status(200).json(dua);
});



module.exports = {
  getDuas,
  CreateDuas,
};