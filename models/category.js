const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Category Name is required"],
      },
      image: {
        type: String,
        required: [true, "Image is required"],
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("categories", categorySchema);