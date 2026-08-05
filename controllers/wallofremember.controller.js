const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const WallOfRemember = require("../models/wallofremember");

const getWallOfRemember = asyncHandler(async (req, res) => {
    const wallofremembers = await WallOfRemember.find()
     .sort({ _id: 1 });
    res.status(200).json(wallofremembers);
  });
  
module.exports = {
    getWallOfRemember,
};
