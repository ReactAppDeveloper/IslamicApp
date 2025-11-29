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
      isfree: {
        type: String,
        required: [true, "Is Free or not"],
      },
      topchoice: {
        type: String,
        required: [true, "Top Choices T/F"],
      },
      newarrival: {
        type: String,
        required: [true, "New Arrival T/F"],
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("islsubcategories", islsubcategorySchema);