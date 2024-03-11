const mongoose = require("mongoose");

const ramadandataSchema = mongoose.Schema(
    {
      ramadanday: {
        type: String,
        default: ""
      },
      ramadancurrentdate: {
        type: String,
        default: ""
      },
      sehrihanafi: {
        type: String,
        default: ""
      },
      iftarihanafi: {
        type: String,
        default: ""
      },
      sehrijafri: {
        type: String,
        default: ""
      },
      iftarijafri: {
        type: String,
        default: ""
      }
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("ramadandatas", ramadandataSchema);