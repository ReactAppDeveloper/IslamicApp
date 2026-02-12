const mongoose = require("mongoose");

const islamiccategorySchema = mongoose.Schema(
    {
      categoryname: {
        type: String,
        required: [true, "Islamic Category Name is required"],
      },
       path: {
        type: String,
        required: [true, "Islamic Category Image is required"],
      },
       color: {
        type: String,
        required: [true, "Islamic Category Color is required"],
      },
      
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("islamiccategories", islamiccategorySchema);