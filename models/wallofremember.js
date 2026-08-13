const mongoose = require("mongoose");

const wallofrememberSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Name is required"],
      },
      path: {
        type: String,
        required: [true, "Path is required"],
      },
      dob: {
        type: String,
        required: [true, "Dob is required"],
      },
      intro: {
        type: String,
        required: [true, "Intro is required"],
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("wallofremembers", wallofrememberSchema);