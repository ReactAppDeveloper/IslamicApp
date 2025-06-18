const mongoose = require("mongoose");

const reelsSchema = mongoose.Schema(
    {
      url: {
        type: String,
        required: [true],
      },
    }
);

module.exports = mongoose.model("reels", reelsSchema);