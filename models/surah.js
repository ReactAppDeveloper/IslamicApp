const mongoose = require("mongoose");

const surahSchema = mongoose.Schema(
    {
      id: {
        type: Number,
        required: [true],
      },
      englishTransliteration: {
        type: String,
        required: [true],
      },
      nameInEnglish: {
        type: String,
        required: [true],
      },
      nameInArabic: {
        type: String,
        required: [true],
      },
      number: {
        type: Number,
        required: [true],
      },
      startAyahId: {
        type: Number,
        required: [true],
      },
      endAyahId: {
        type: Number,
        required: [true],
      },
      origin: {
        type: String,
        required: [true],
      },
    },
);

module.exports = mongoose.model("surahs", surahSchema);