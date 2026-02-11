const mongoose = require("mongoose");

const quranicduasSchema = mongoose.Schema(
    {
        quranicduatitle: {
        type: String,
        default: ""
      },
      quranicduaarabic: {
        type: String,
        default: ""
      },
      quranicduatrasnlation: {
        type: String,
        default: ""
      }
    }
);

module.exports = mongoose.model("quranicduas", quranicduasSchema);