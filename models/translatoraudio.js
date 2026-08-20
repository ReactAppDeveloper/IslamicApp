const mongoose = require("mongoose");

const translatoraudiosSchema = mongoose.Schema(
    {
      reciterid:{
        type: String,
        required: [true, "Reciter ID is required"],
      },
      chapter_id: {
        type: String,
        required: [true, "Chapter id is required"],
      },
      format:{
        type: String,
        required: [true, "Format is required"],
      },
      audio_url: {
        type: String,
        required: [true, "Audio url is required"],
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("translatoraudios", translatoraudiosSchema);