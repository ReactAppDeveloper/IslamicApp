const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const RamazanDuas = require("../models/ramazanduas");

const getRamazanDuas = asyncHandler(async (req, res) => {
    const ramazanduas = await RamazanDuas.find()
      .skip(parseInt(req.query.start))
      .limit(parseInt(req.query.limit));
    res.status(200).json(ramazanduas);
  });
  
module.exports = {
    getRamazanDuas,
};
