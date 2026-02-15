const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const RamazanDuas = require("../models/ramazanduas");

const getRamazanDuas = asyncHandler(async (req, res) => {
    const ramazanduas = await RamazanDuas.find()
      .sort({ _id: 1 });
    res.status(200).json(ramazanduas);
  });
  
module.exports = {
    getRamazanDuas,
};
