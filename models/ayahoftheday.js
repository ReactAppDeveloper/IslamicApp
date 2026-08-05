const mongoose = require("mongoose");

const ayahofthedaySchema = mongoose.Schema(
    {
      arabic: {
        type: String,
        required: [true, "Name is required"],
      },
      translation: {
        type: String,
        required: [true, "Path is required"],
      },
      referrence: {
        type: String,
        required: [true, "Dob is required"],
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("ayahofthedays", ayahofthedaySchema);