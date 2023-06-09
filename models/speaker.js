const mongoose = require("mongoose");

const speakerSchema = mongoose.Schema(
    {
      speakerName: {
        type: String,
        required: [true, "Speaker Name is required"],
      },
      coverImage: {
        type: String,
        default: ""
      },
      videoCount: {
        type: Number,
        default: 0
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("speakers", speakerSchema);