const mongoose = require("mongoose");

const duaversesSchema = mongoose.Schema(
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
      duafor: {
        type: String,
        required: [true],
      },
      duainarabic: {
        type: String,
        required: [true],
      },
      duatranslation: {
        type: String,
        required: [true],
      },
      duatransliteration: {
        type: String,
        required: [true],
      },
      duareferrence: {
        type: String,
        required: [true],
      }
    },
);

module.exports = mongoose.model("duaverses", duaversesSchema);