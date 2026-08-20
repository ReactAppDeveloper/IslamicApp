const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Translator = require("../models/translator");

const getTranslator = asyncHandler(async (req, res) => {
    const translator = await Translator.find()
     .sort({ _id: 1 });
    res.status(200).json(translator);
  });
  
module.exports = {
    getTranslator,
};
