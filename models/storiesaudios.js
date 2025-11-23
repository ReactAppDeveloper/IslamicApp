const mongoose = require("mongoose");

const storiesaudiosSchema = mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "Story Title is required"],
      },
      path: {
        type: String,
        required: [true, "Story image path is required"],
      },
      categoryname: {
        type: String,
        required: [true, "Story name is required"],
      },
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "islamiccategories",
      },
      storyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "islsubcategories",
      },
      language: {
        type: String,
        required: [true, "Story language is required"],
      },
      duration: {
        type: String,
        required: [true, "Story duration is required"],
      },
      reference : {
        type: String,
        required: [true, "Story reference is required"],
      },
      audiotype : {
        type: String,
        required: [true, "Story audiotype is required"],
      },
      audiourl : {
        type: String,
        required: [true, "Story audiourl is required"],
      },
      ratingvalue : {
        type: String,
        required: [true, "Story ratingvalue is required"],
      },
      
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("storiesaudios", storiesaudiosSchema);