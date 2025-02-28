const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const RamadanTime = require("../models/ramadantime");

const getRamadanTimes = asyncHandler(async (req, res) => {
    const ramadantimes = await RamadanTime.find()
      .skip(parseInt(req.query.start))
      .limit(parseInt(req.query.limit));
    res.status(200).json(ramadantimes);
  });
  
module.exports = {
    getRamadanTimes,
};
