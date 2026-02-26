const mongoose = require("mongoose");

const quranPageSchema = new mongoose.Schema(
  {
    page: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("quranpages", quranPageSchema);