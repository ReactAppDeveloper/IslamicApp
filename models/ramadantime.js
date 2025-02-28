const mongoose = require("mongoose");

const ramadantimeSchema = mongoose.Schema(
    {
        maslak: {
        type: String,
        default: ""
      },
      sehritime: {
        type: String,
        default: ""
      },
      iftaritime: {
        type: String,
        default: ""
      },
    },
);

module.exports = mongoose.model("ramadantimes", ramadantimeSchema);