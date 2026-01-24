const mongoose = require("mongoose");

const duasSchema = mongoose.Schema(
    {
      duacategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "duacategories",
      },
      duanameenglish: {
        type: String,
        required: [true],
      },
      duacontains: {
        type: String,
        required: [true],
      },
      
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("duas", duasSchema);