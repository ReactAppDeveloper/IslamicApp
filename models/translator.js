const mongoose = require("mongoose");

const translatorsSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Name is required"],
      },
      reciterid:{
        type: String,
        required: [true, "Reciter ID is required"],
      },
      description: {
        type: String,
        required: [true, "Description is required"],
      },
      path: {
        type: String,
        required: [true, "Image path is required"],
      },
      language: {
        type: String,
        required: [true, "Language is required"],
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("translators", translatorsSchema);