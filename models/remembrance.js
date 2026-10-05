const mongoose = require("mongoose");

const remembranceSchema = new mongoose.Schema(
  {
    // Person submitting the remembrance
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    relationship: {
      type: String,
      required: true,
      trim: true,
    },

    // Deceased person
    lovedOneName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      required: true,
      trim: true,
    },

    shortdescription: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // Cloudinary image
    photo: {
      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        required: true,
      },
    },

    // Admin approval
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "remembrance",
  remembranceSchema
);