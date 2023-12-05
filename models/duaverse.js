const mongoose = require("mongoose");

const duaversesSchema = mongoose.Schema(
    {
     
      duanameenglish: {
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
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("duaverses", duaversesSchema);