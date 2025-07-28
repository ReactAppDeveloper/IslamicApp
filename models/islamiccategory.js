const mongoose = require("mongoose");

const islamiccategorySchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Islamic Category Name is required"],
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("islamiccategories", islamiccategorySchema);