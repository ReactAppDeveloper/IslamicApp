const asyncHandler = require("express-async-handler");
const Tasbihs = require("../models/tasbihs");
const mongoose = require("mongoose");
//@desc Get all Hadees books
//@route GET /api/hadeesbooks
//@access private
const getTasbihs= asyncHandler(async (req, res) => {
  const tasbihs = await Tasbihs.find()
    .sort({ id: 1 });
  res.status(200).json(tasbihs);
});


module.exports = {
    getTasbihs,
};