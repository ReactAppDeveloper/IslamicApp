const asyncHandler = require("express-async-handler");
const TranslatorAudio = require("../models/translatoraudio");
const mongoose = require("mongoose");

const getTranslatorAudio= asyncHandler(async (req, res) => {
  const translatoraudio = await TranslatorAudio.find()
    .sort({ _id: 1 });
  res.status(200).json(translatoraudio);
});

const getTranslatorAudioByReciterID = asyncHandler(async (req, res) => {
  const translatoraudio = await TranslatorAudio.find({ reciterid: new mongoose.Types.ObjectId(req.query.reciterid) })
    .sort({ _id: 1 });
  res.status(200).json(translatoraudio);
});

const getindTranslatorAudio = asyncHandler(async (req, res) => {
  const translatoraudio = await TranslatorAudio.find(new mongoose.Types.ObjectId(req.params.id))
  res.status(200).json(translatoraudio);
});

module.exports = {
  getTranslatorAudio,
  getTranslatorAudioByReciterID,
  getindTranslatorAudio,
};