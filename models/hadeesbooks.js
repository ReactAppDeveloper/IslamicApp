const mongoose = require("mongoose");

const hadeeesbooksSchema = mongoose.Schema(
    {
      id: {
        type: Number,
        required: [true],
      },
      bookName: {
        type: String,
        required: [true],
      },
      writerName: {
        type: String,
        required: [true],
      },
      aboutWriter: {
        type: String,
        required: [true],
      },
      writerDeath: {
        type: String,
        required: [true],
      },
      bookSlug: {
        type: String,
        required: [true],
      },
      hadiths_count: {
        type: String,
        required: [true],
      },
      chapters_count: {
        type: String,
        required: [true],
      }
    },
);

module.exports = mongoose.model("hadeesbooks", hadeeesbooksSchema);