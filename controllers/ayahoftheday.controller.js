const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const AyahOfTheDay = require("../models/ayahoftheday");

const getAyahOfTheDays = asyncHandler(async (req, res) => {
    const ayahofthedays = await AyahOfTheDay.find()
     .sort({ _id: 1 });
    res.status(200).json(ayahofthedays);
  });
  
module.exports = {
    getAyahOfTheDays,
};
