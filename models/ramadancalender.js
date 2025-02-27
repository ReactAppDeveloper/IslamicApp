const mongoose = require("mongoose");

const ramadancalenderSchema = mongoose.Schema(
    {
      ramadandateday: {
        type: String,
        default: ""
      },
      ramadanday: {
        type: String,
        default: ""
      },
      sehrihanafitime: {
        type: String,
        default: ""
      },
      iftarihanafitime: {
        type: String,
        default: ""
      },
      sehrijafritime: {
        type: String,
        default: ""
      },
      iftarijafritime: {
        type: String,
        default: ""
      }
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("ramadancalenders", ramadancalenderSchema);