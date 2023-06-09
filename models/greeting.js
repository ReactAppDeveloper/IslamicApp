const mongoose = require("mongoose");

const greetingSchema = mongoose.Schema(
    {
      path: {
        type: String,
        required: [true, "Greeting Card path is required"],
      },
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "categories",
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("greetings", greetingSchema);