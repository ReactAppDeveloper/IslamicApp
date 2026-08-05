const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const DidYouKnow = require("../models/didyouknow");

const getDidYouKnows = asyncHandler(async (req, res) => {
    const didyouknows = await DidYouKnow.find()
     .sort({ _id: 1 });
    res.status(200).json(didyouknows);
  });
  
module.exports = {
    getDidYouKnows,
};
