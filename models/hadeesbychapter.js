const mongoose = require("mongoose");

const hadeeesbychapterSchema = mongoose.Schema(
    {
      id: {
        type: Number,
        required: [true],
      },
      hadithNumber: {
        type: String,
        required: [true],
      },
      englishNarrator: {
        type: String,
        required: [true],
      },
      hadithEnglish: {
        type: String,
        required: [true],
      },
      urduNarrator: {
        type: String,
        required: [true],
      },
      hadithArabic: {
        type: String,
        required: [true],
      },
      headingArabic: {
        type: String,
        required: [true],
      },
      headingUrdu: {
        type: String,
        required: [true],
      },
      headingEnglish: {
        type: String,
        required: [true],
      },
      chapterId: {
        type: String,
        required: [true],
      },
      bookSlug: {
        type: String,
        required: [true],
      },
      volume: {
        type: String,
        required: [true],
      },
      status: {
        type: String,
        required: [true],
      },
      book: [{
           id: {
            type: Number,
            required: [true],
           },
           bookName: {
            type: String,
            required: [true],
           },
           writerName: {
            type: String,
            required: [true],
           },
           aboutWriter: {
            type: String,
            required: [true],
           },
           writerDeath: {
            type: String,
            required: [true],
           },
           bookSlug: {
            type: String,
            required: [true],
           },
      }],
    chapter: [{
        id: {
         type: Number,
         required: [true],
        },
        chapterNumber: {
         type: String,
         required: [true],
        },
        chapterEnglish: {
         type: String,
         required: [true],
        },
        chapterUrdu: {
         type: String,
         required: [true],
        },
        chapterArabic: {
         type: String,
         required: [true],
        },
        bookSlug: {
         type: String,
         required: [true],
        },
      }],
    },
);

module.exports = mongoose.model("hadeesbychapters", hadeeesbychapterSchema);