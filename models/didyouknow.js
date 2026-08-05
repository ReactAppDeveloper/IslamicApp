const mongoose = require("mongoose");

const didyouknowSchema = mongoose.Schema(
    {
      content: {
        type: String,
        default: ""
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("didyouknows", didyouknowSchema);