const mongoose = require("mongoose");

     
const juzSchema = mongoose.Schema(
    {
      id: {
        type: Number,
        required: [true],
      },
      juz_name: {
        type: String,
        required: [true],
      }
    },
);

module.exports = mongoose.model("juzs", juzSchema);