const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const QuranicDuas = require("../models/quranicduas");

const getQuranicDuas = asyncHandler(async (req, res) => {
    const quranicduas = await QuranicDuas.find()
      .skip(parseInt(req.query.start))
      .limit(parseInt(req.query.limit));
    res.status(200).json(quranicduas);
  });
  
module.exports = {
    getQuranicDuas,
};
