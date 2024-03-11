const mongoose = require("mongoose");

const ramadanvideoSchema = mongoose.Schema(
    {
      videoTitle: {
        type: String,
        required: [true, "Video Title is required"],
      },
      thumbnail: {
        type: String,
        default: ""
      },
      videoLink: {
        type: String,
        required: [true, "Video Title is required"],
      },
      videochannelname: {
        type: String,
        required: [true],
      },
      summary: {
        type: String,
        default: ""
      },
      speakerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "speakers",
      }
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("ramadanvideos", ramadanvideoSchema);