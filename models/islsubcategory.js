const mongoose = require("mongoose");

const islsubcategorySchema = mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "Sub Category Title is required"],
      },
      path: {
        type: String,
        required: [true, "Sub Category image path is required"],
      },
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "islamiccategories",
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("islsubcategories", islsubcategorySchema);