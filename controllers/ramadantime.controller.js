const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const RamadanTime = require("../models/ramadantime");

const getRamadanTimes = asyncHandler(async (req, res) => {
    const ramadantimes = await RamadanTime.find()
     .sort({ _id: 1 });
    res.status(200).json(ramadantimes);
  });
  
module.exports = {
    getRamadanTimes,
};
