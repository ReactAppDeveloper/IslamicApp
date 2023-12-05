const mongoose = require("mongoose");

const duasSchema = mongoose.Schema(
    {
      duanameenglish: {
        type: String,
        required: [true],
      },
      duacontains: {
        type: String,
        required: [true],
      },
      duaID:{
        type:String
      }
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("duas", duasSchema);