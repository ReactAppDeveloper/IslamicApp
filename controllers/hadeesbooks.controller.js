const asyncHandler = require("express-async-handler");
const Hadeesbooks = require("../models/hadeesbooks");
//@desc Get all Hadees books
//@route GET /api/hadeesbooks
//@access private
const getHadeesbooks= asyncHandler(async (req, res) => {
  const hadeesbooks = await Hadeesbooks.find()
    .sort({ id: 1 });
  res.status(200).json(hadeesbooks);
});

module.exports = {
    getHadeesbooks,
};