const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const RamadanData = require("../models/ramadandata");

const getRamadanDatas = asyncHandler(async (req, res) => {
    const ramadandatas = await RamadanData.find()
     .sort({ _id: 1 });
    res.status(200).json(ramadandatas);
  });
  
module.exports = {
    getRamadanDatas,
};
