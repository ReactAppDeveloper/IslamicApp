const mongoose = require("mongoose");

const videochannelSchema = mongoose.Schema(
    {
      videochannelname: {
        type: String,
        required: [true],
      },
      videochannelimage: {
        type: String,
        required: [true],
      },
    },
);

module.exports = mongoose.model("videochannels", videochannelSchema);