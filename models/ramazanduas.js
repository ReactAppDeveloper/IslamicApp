const mongoose = require("mongoose");

const ramazanduasSchema = mongoose.Schema(
    {
        ramazanduatitle: {
        type: String,
        default: ""
      },
      ramazanduaarabic: {
        type: String,
        default: ""
      },
      ramazanduatrasnlation: {
        type: String,
        default: ""
      }
    }
);

module.exports = mongoose.model("ramazanduas", ramazanduasSchema);