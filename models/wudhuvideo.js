const mongoose = require("mongoose");

const wudhuvideoSchema = mongoose.Schema(
    {
      videoTitle: 
      {
        type: String,
         default: ""
      },
      thumbnail: 
      {
        type: String,
         default: ""
      },
      videoLink: 
      {
        type: String,
        default: ""
      },
      summary: 
      {
        type: String,
        default: ""
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("wudhuvideos", wudhuvideoSchema);