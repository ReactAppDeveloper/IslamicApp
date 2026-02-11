  const mongoose = require("mongoose");

  const homeduaSchema = mongoose.Schema(
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
        }
      }
  );

  module.exports = mongoose.model("homeduas", homeduaSchema);