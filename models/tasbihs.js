const mongoose = require("mongoose");

const tasbihsSchema = mongoose.Schema(
    {
       tasbihnameenglish: {
        type: String,
        required: [true],
      },
      tasbihID: {
        type: String,
        required: [true],
      }
    },
);

module.exports = mongoose.model("tasbihs", tasbihsSchema);