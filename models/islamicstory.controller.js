const mongoose = require("mongoose");

const islamicstorySchema = mongoose.Schema(
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
      isfree: {
        type: String,
        required: [true, "Is Free or not"],
      },
      language: {
        type: String,
        required: [true, "Story language is required"],
      },
      shortdescription: {
        type: String,
        required: [true, "Story shortdescription is required"],
      },
      longdescription: {
        type: String,
        required: [true, "Longdescription is required"],
      },
      duration: {
        type: String,
        required: [true, "Story duration is required"],
      },
      reference : {
        type: String,
        required: [true, "Story reference is required"],
      },
      ratingvalue : {
        type: String,
        required: [true, "Story ratingvalue is required"],
      },
      audiourl : {
        type: String,
        required: [true, "Story audiourl is required"],
      },
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model("islamicstories", islamicstorySchema);