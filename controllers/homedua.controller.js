const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const HomeDua = require("../models/homedua");

const getHomeDuas = asyncHandler(async (req, res) => {
    const homeduas = await HomeDua.find()
      .sort({ _id: 1 });
    res.status(200).json(homeduas);
  });
  
module.exports = {
    getHomeDuas,
};
