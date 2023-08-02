const mongoose = require("mongoose");

     
const juzSchema = mongoose.Schema(
    {
      id: {
        type: Number,
        required: [true],
      },
      juznamearabic: {
        type: String,
        required: [true],
      },
      juznameroman: {
        type: String,
        required: [true],
      },
      juzsequence: {
        type: String,
        required: [true],
      }
    },
);

module.exports = mongoose.model("juzs", juzSchema);