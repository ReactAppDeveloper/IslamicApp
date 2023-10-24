const mongoose = require("mongoose");

const duasSchema = mongoose.Schema(
    {
      id: {
        type: Number,
        required: [true],
      },
      duanameenglish: {
        type: String,
        required: [true],
      },
      duaId: {
        type: String,
        required: [true],
      },
      duacontains: {
        type: String,
        required: [true],
      }
    },
);

module.exports = mongoose.model("duas", duasSchema);