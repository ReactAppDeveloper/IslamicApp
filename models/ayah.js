const mongoose = require("mongoose");

const ayahSchema = mongoose.Schema(
    {
      'ayah__id': {
        type: Number,
      },
      'page_number': {
        type: Number,
      },
      'ayah__numberInSurah': {
        type: Number,
      },
      'ayah__text': {
        type: String,
      },
      'ayah__surahId': {
        type: Number,
      },
      'ayah__duaId': {
        type: String,
      },
      'ayah__isDua': {
        type: String,
      },
      'surah__id': {
        type: Number,
      },
      'surah__englishTransliteration': {
        type: String,
      },
      'surah__nameInEnglish': {
        type: String,
      },
      'surah__nameInArabic': {
        type: String,
      },
      'surah__number': {
        type: Number,
      },
      'surah__startAyahId': {
        type: Number,
      },
      'surah__endAyahId': {
        type: Number,
      },
      'surah__origin': {
        type: String,
      },
      'scriptType': {
        type: Number,
      },
      'ayahTranslation__id': {
        type: Number,
      },
      'ayahTranslation__ayahId': {
        type: Number,
      },
      'ayahTranslation__language': {
        type: String,
      },
      'ayahTranslation__author': {
        type: String,
      },
      'ayahTranslation__translationText': {
        type: String,
      },
      'juz__id': {
        type: Number,
      },
      'juz__number': {
        type: Number,
      },
    },
);

module.exports = mongoose.model("ayahs", ayahSchema, "ayahs");