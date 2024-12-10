import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  chapterDetail: [],
  selectedSurahItem: '',
  juzList: [],
  verseList: [],
  pagesList: [],
  isVisible: false,
  isSpeedCounting: 1,
  isArabic: true,
  isTranslation: true,
  isTransliteration: true,
  arabicFontSize: 24,
  translationFontSize: 12,
  isArabicFont: {
    id: 1,
    key: 'arabic_Al_Qalam',
    fontTitle: 'Al Qalam Quran Majeed',
  },
  translationList: 131,
  transliterationList: 131,
  translationLanguage: {_index: 0, id: 1, language: 'english', name: 'English'},
  transliterationLanguage: {
    _index: 0,
    id: 1,
    language: 'english',
    name: 'English',
  },
  tafseerLanguage: {_index: 0, id: 1, name: 'English', language: 'english'},
  tafseerAuthor: [],
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,

  reducers: {
    setChapterDetail: (state, action) => {
      state.chapterDetail = action.payload;
    },
    setSelectedSurahItem: (state, action) => {
      state.selectedSurahItem = action.payload;
    },
    setJuzList: (state, action) => {
      state.juzList = action.payload;
    },
    setVerseList: (state, action) => {
      state.verseList = action.payload;
    },

    setPagesList: (state, action) => {
      state.pagesList = action.payload;
    },
    setArabicFontSize: (state, action) => {
      state.arabicFontSize = action.payload;
    },
    setTranslationFontSize: (state, action) => {
      state.translationFontSize = action.payload;
    },
    setVisible: (state, action) => {
      state.isVisible = action.payload;
    },
    setSpeedCounting: (state, action) => {
      state.isSpeedCounting = action.payload;
    },
    setArabic: (state, action) => {
      state.isArabic = action.payload;
    },
    setTranslation: (state, action) => {
      state.isTranslation = action.payload;
    },
    setTransliteration: (state, action) => {
      state.isTransliteration = action.payload;
    },
    setTranslationList: (state, action) => {
      state.translationList = action.payload;
    },
    setTranslationLanguage: (state, action) => {
      state.translationLanguage = action.payload;
    },
    setTransliterationList: (state, action) => {
      state.transliterationList = action.payload;
    },
    setTransliterationLanguage: (state, action) => {
      state.transliterationLanguage = action.payload;
    },
    setArabicFont: (state, action) => {
      state.isArabicFont = action.payload;
    },
    setTafseerLanguage: (state, action) => {
      state.tafseerLanguage = action.payload;
    },
    setTafseerAuthor: (state, action) => {
      state.tafseerAuthor = action.payload;
    },
  },
});

export const {
  setChapterDetail,
  setSelectedSurahItem,
  setJuzList,
  setVerseList,
  setPagesList,
  setVisible,
  setArabicFontSize,
  setTranslationFontSize,
  setSpeedCounting,
  setArabic,
  setTranslation,
  setTransliteration,
  setTranslationList,
  setTranslationLanguage,
  setTransliterationList,
  setTransliterationLanguage,
  setArabicFont,
  setTafseerLanguage,
  setTafseerAuthor,
} = servicesSlice.actions;

export default servicesSlice.reducer;
