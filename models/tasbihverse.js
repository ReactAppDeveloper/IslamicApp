const mongoose = require("mongoose");

const tasbihversesSchema = mongoose.Schema(
    {
      tasbihnameenglish: {
        type: String,
        required: [true],
      },
      tasbihinarabic: {
        type: String,
        required: [true],
      },
      tasbihtransliteration: {
        type: String,
        required: [true],
      },
      tasbihpurpose: {
        type: String,
        required: [true],
      }
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("tasbihverses", tasbihversesSchema);