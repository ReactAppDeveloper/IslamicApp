const mongoose = require("mongoose");

const hadeeesbookchapterSchema = mongoose.Schema(
    {
        id: {
        type: Number,
        required: [true],
      },
      chapterNumber: {
        type: String,
        required: [true],
      },
      chapterEnglish: {
        type: String,
        required: [true],
      },
      chapterUrdu: {
        type: String,
        required: [true],
      },
      chapterArabic: {
        type: String,
        required: [true],
      },
      bookSlug: {
        type: String,
        required: [true],
      }
    },
);

module.exports = mongoose.model("hadeesbookchapters", hadeeesbookchapterSchema);