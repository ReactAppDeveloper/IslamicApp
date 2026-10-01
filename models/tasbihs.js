const mongoose = require("mongoose");

const tasbihsSchema = mongoose.Schema(
    {
       tasbihnameenglish: {
        type: String,
        required: [true],
      },
       path: {
        type: String,
        required: [true],
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("tasbihs", tasbihsSchema);