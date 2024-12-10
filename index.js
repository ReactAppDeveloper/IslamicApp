import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {isEmpty} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator,Alert,AppState,BackHandler,Dimensions,Image,ImageBackground,TouchableOpacity,InteractionManager,Platform,ScrollView,Text,View,Button} from 'react-native';
import Share from 'react-native-share';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import TrackPlayer, {useProgress,usePlaybackState} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {getAudioUrlByChapter,getAudioUrlByJuz,getChapterIdBySlug,getChapterVerses,getJuzVerses,getPagesLookup,getRangeVerses,} from '../../api';
import AyahViewComponent from '../../components/AyahViewComponent';
import BottomView from '../../components/BottomView';
import EmptyView from '../../components/EmptyView';
import Header from '../../components/Header';
import ModalComponent from '../../components/ModalComponent';
import PinMessage from '../../components/PinMessage';
import ReciterModal from '../../components/ReciterModal';
import SearchModalComponent from '../../components/SearchModalComponent';
import TopRowComponent from '../../components/TopRowComponent';
import ar from '../../data/chapters/ar.json';
import localeLanguage from '../../helper/localLanguage';
import {getStorageItem, setStorageItem} from '../../mmkvStorage/storeData';
import {getQuranReaderStylesInitialState} from '../../redux/defaultSettings/util';
import {setSpeedCounting,setVerseList,} from '../../redux/reduxToolkit/store/servicesSlice';
import {COLORS, FONTS, FONTSTYLE, IMAGES} from '../../theme';
import {SIZES} from '../../theme/Sizes';
import {QuranReaderDataType} from '../../types/QuranReader';
import {getDefaultWordFields, getMushafId} from '../../utils/api';
import {getAllChaptersData, getChapterData} from '../../utils/chapter';
import {formatStringNumber} from '../../utils/number';
import { ONE_WEEK_REVALIDATION_PERIOD_SECONDS,REVALIDATION_PERIOD_ON_ERROR_SECONDS,} from '../../utils/staticPageGeneration';
import {isRangesStringValid,isValidChapterId,isValidJuzId,isValidVerseKey,} from '../../utils/validator';
import {getVerseAndChapterNumbersFromKey} from '../../utils/verse';
import {generateVerseKeysBetweenTwoVerseKeys,parseVerseRange,} from '../../utils/verseKeys';

const SurahDetailPage = ({navigation, route}) => {
  const {ayahIdFromBookmark,selectedAyahItems,selectedSurahItems,fromPinAyah,fromBookmarkAyah,fromjuz,} = route.params;
  const reciters = getStorageItem('reciters');
  const saveCurrentAyah = getStorageItem('saveCurrentAyah');
  const bookmarksList = getStorageItem('bookmark');
  const arabicFontSize = useSelector(state => state.services.arabicFontSize);
  const isArabicFont = useSelector(state => state.services.isArabicFont);
  const translationList = useSelector(state => state.services.translationList);
  const isSpeedCounting = useSelector(state => state.services.isSpeedCounting);
  const verseList = useSelector(state => state.services.verseList);
  const recitersList = useSelector(state => state.reciters.recitersDetaList);
  const [showLoader, setShowLoader] = useState(true);
  const [surahDetail, setSurahDetail] = useState(selectedSurahItems);
  const [verseDetailList, setVerseDetailList] = useState(verseList?.verses || [],);
  const [isPinAyahItem, setIsPinAyahItem] = useState('');
  const [isGetPinAyah, setIsGetPinAyah] = useState('');
  const [isBookmark, setBookmark] = useState([]);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [isPlay, setIsPlay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reciteModalVisible, setReciteModalVisible] = useState(false);
  const [showPinMessage, setShowPinMessage] = useState(false);
  const [openAyahDetailView, setOpenAyahDetailView] = useState(false);
  const [lastPlayAyahVisible, setLastPlayAyahVisible] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState('');
  const [audioList, setAudioList] = useState([]);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState({});
  const [currentAyahIndex, setCurrentAyahIndex] = useState(null);
  const [fromPlayIcon, setFromPlayIcon] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [itemHeights, setItemHeights] = useState([]);
  const progress = useProgress();
  const scrollingRef = useRef();
  const animationFrameId = useRef(null);
  const ayahRefs = useRef(null);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {height: HEIGHT} = Dimensions.get('window');
  const [layout, setLayout] = useState(null);
  const [additionalTexts, setAdditionalTexts] = useState({});
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const surahLookup = {
    "1": { transliteratedName: "Al-Fatihah", translatedName: "The Opening", revelationPlace: "Makkah", versesCount: 7 },
    "2": { transliteratedName: "Al-Baqarah", translatedName: "The Cow", revelationPlace: "Madinah", versesCount: 286 },
    "3": { transliteratedName: "Aal-E-Imran", translatedName: "The Family of Imran", revelationPlace: "Madinah", versesCount: 200 },
    // Add more Surahs here as needed
  };
  const getSurahDetail = (surahId) => surahLookup[surahId] || { transliteratedName: `Surah ${surahId}`, translatedName: "Unknown", revelationPlace: "Unknown", versesCount: 0 };

  useEffect(() => {
    const handleAppStateChange = currentState => {
      if (currentState === 'inactive') {
        stopAudioPlay();
      }
      if (currentState === 'background') {
        TrackPlayer.stop();
        setIsPlaying(false);
      }
    };
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
      stopAudioPlay();
    };
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      if (fromjuz) {
        getJuzVerse({id: surahDetail?.id, locale: localeLanguage});
      } else {
        getSurahVerse({id: surahDetail?.id, locale: localeLanguage});
      }
      getBookmarkList();
      setShowLoader(true);
    }, []),
  );

  useEffect(() => {
    const backAction = async () => {
      if (fromBookmarkAyah) {
        navigation?.navigate('DashBoard');
      } else {
        navigation.navigate('DashBoard', {
          tabIndex: 0,
        });
      }
      await TrackPlayer.pause();
      stopAudioPlay();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    getPinAyahItem();
  }, []);

  useEffect(() => {
    if (currentPlayingAyah) {
      const index = verseDetailList?.findIndex(
        item => item?.verseKey === currentPlayingAyah?.verseKey,
      );
      if (
        index !== -1 &&
        itemHeights?.length === verseDetailList?.length &&
        itemHeights?.every(height => height !== undefined)
      ) {
        scrollToCurrentAyah(index);
      }
    }
  }, [currentPlayingAyah, itemHeights]);

  const handleLayout = event => {
    const {x, y, width, height} = event?.nativeEvent?.layout;
    setLayout({x, y, width, height});
  };

  const onItemLayout = (event, index) => {
    const {height} = event.nativeEvent.layout;
    console.log(`Height of item ${index}: ${height}`);
    setItemHeights(prevHeights => {
      const newHeights = [...prevHeights];
      newHeights[index] = height;
      return newHeights;
    });
  };

  const getSurahVerse = async ({id, locale}) => {
    let chapterIdOrVerseKeyOrSlug = String(id);
    let isValidChapter = isValidChapterId(chapterIdOrVerseKeyOrSlug);
    const chaptersData = await getAllChaptersData(locale);
    const isValidRanges = isRangesStringValid(
      chaptersData,
      chapterIdOrVerseKeyOrSlug,
    );
    // initialize the value as if it's chapter
    let chapterId = chapterIdOrVerseKeyOrSlug;
    if (
      !isValidRanges &&
      !isValidChapter &&
      !isValidVerseKey(chaptersData, chapterIdOrVerseKeyOrSlug)
    ) {
      // if the value is a slug of Ayatul Kursi
      if (AYAH_KURSI_SLUGS.includes(chapterIdOrVerseKeyOrSlug.toLowerCase())) {
        chapterIdOrVerseKeyOrSlug = '2:255';
      } else {
        const sluggedChapterId = await getChapterIdBySlug(
          chapterIdOrVerseKeyOrSlug,
          locale,
        );
        // if it's not a valid slug
        if (!sluggedChapterId) {
          return {notFound: true};
        }
        chapterId = sluggedChapterId;
        isValidChapter = true;
      }
    }
    const defaultMushafId = getMushafId(
      getQuranReaderStylesInitialState(locale).quranFont,
      getQuranReaderStylesInitialState(locale).mushafLines,
    ).mushaf;
    // common API params between a chapter and the verse key.
    let apiParams = {
      ...getDefaultWordFields(
        getQuranReaderStylesInitialState(locale).quranFont,
      ),
      mushaf: defaultMushafId,
    };
    let numberOfVerses = 1;
    let pagesLookupResponse = null;
    try {
      // if it's a range of verses e.g. 2:255-2:256
      if (isValidRanges) {
        const [{verseKey: fromVerseKey}, {verseKey: toVerseKey}] =
          parseVerseRange(chapterIdOrVerseKeyOrSlug);
        pagesLookupResponse = await getPagesLookup({
          mushaf: defaultMushafId,
          from: fromVerseKey,
          to: toVerseKey,
        });
        numberOfVerses = generateVerseKeysBetweenTwoVerseKeys(
          chaptersData,
          pagesLookupResponse.lookupRange.from,
          pagesLookupResponse.lookupRange.to,
        ).length;
        const firstPageOfRange = Object.keys(pagesLookupResponse.pages)[0];
        const firstPageOfChapterLookup =
          pagesLookupResponse.pages[firstPageOfRange];
        let versesResponse = await getRangeVerses(locale, {
          ...apiParams,
          ...{
            perPage: 'all',
            // from: firstPageOfChapterLookup.from,
            // to: firstPageOfChapterLookup.to,
          },
        });
        const metaData = {numberOfVerses};

        versesResponse.metaData = metaData;
        versesResponse.pagesLookup = pagesLookupResponse;
        return {
          props: {
            chaptersData,
            versesResponse,
            quranReaderDataType: QuranReaderDataType.Ranges,
          },
          revalidate: ONE_WEEK_REVALIDATION_PERIOD_SECONDS, // chapters will be generated at runtime if not found in the cache, then cached for subsequent requests for 7 days.
        };
      }
      // if it's a verseKey
      if (!isValidChapter) {
        const [extractedChapterId, verseNumber] =
          getVerseAndChapterNumbersFromKey(chapterIdOrVerseKeyOrSlug);
        chapterId = extractedChapterId;
        // only get 1 verse
        apiParams = {...apiParams, ...{page: verseNumber, perPage: 1}};
        pagesLookupResponse = await getPagesLookup({
          chapterNumber: Number(chapterId),
          mushaf: defaultMushafId,
          from: chapterIdOrVerseKeyOrSlug,
          to: chapterIdOrVerseKeyOrSlug,
        });
      } else {
        // if it's a chapter
        pagesLookupResponse = await getPagesLookup({
          chapterNumber: Number(chapterId),
          mushaf: defaultMushafId,
        });
        numberOfVerses = generateVerseKeysBetweenTwoVerseKeys(
          chaptersData,
          pagesLookupResponse.lookupRange.from,
          pagesLookupResponse.lookupRange.to,
        ).length;
        const firstPageOfChapter = Object.keys(pagesLookupResponse.pages)[0];

        const firstPageOfChapterLookup =
          pagesLookupResponse.pages[firstPageOfChapter];

        apiParams = {
          ...apiParams,
          ...{
            perPage: 1000,
            translations: translationList,
            // from: firstPageOfChapterLookup.from,
            // to: firstPageOfChapterLookup.to,
          },
        };
      }

      let versesResponse = await getChapterVerses(
        formatStringNumber(chapterId),
        locale,
        apiParams,
      );
      const metaData = {numberOfVerses};

      versesResponse.metaData = metaData;
      versesResponse.pagesLookup = pagesLookupResponse;
      dispatch(setVerseList(versesResponse));
      setVerseDetailList(versesResponse?.verses);
      setShowLoader(false);

      return {
        props: {
          chaptersData,
          chapterResponse: {
            chapter: {
              ...getChapterData(chaptersData, chapterId),
              id: chapterId,
            },
          },
          versesResponse,
          quranReaderDataType: isValidChapter
            ? QuranReaderDataType.Chapter
            : QuranReaderDataType.Verse,
        },
        revalidate: ONE_WEEK_REVALIDATION_PERIOD_SECONDS, // chapters will be generated at runtime if not found in the cache, then cached for subsequent requests for 7 days.
      };
    } catch (error) {
      console.log('DEFAULT_VERSES_PARAMS=======error', error);

      return {
        props: {hasError: true},
        revalidate: REVALIDATION_PERIOD_ON_ERROR_SECONDS, // 35 seconds will be enough time before we re-try generating the page again.
      };
    }
  };

  const getJuzVerse = async ({id, locale}) => {
    let juzId = String(id);

    if (!isValidJuzId(juzId)) {
      return {
        notFound: true,
      };
    }

    const chaptersData = await getAllChaptersData(locale);
    juzId = formatStringNumber(juzId);

    const defaultMushafId = getMushafId(
      getQuranReaderStylesInitialState(locale).quranFont,
      getQuranReaderStylesInitialState(locale).mushafLines,
    ).mushaf;
    try {
      const pagesLookupResponse = await getPagesLookup({
        juzNumber: Number(juzId),
        mushaf: defaultMushafId,
      });
      const firstPageOfJuz = Object.keys(pagesLookupResponse.pages)[0];
      const firstPageOfJuzLookup = pagesLookupResponse.pages[firstPageOfJuz];
      const numberOfVerses = generateVerseKeysBetweenTwoVerseKeys(
        chaptersData,
        pagesLookupResponse.lookupRange.from,
        pagesLookupResponse.lookupRange.to,
      ).length;
      const juzVersesResponse = await getJuzVerses(juzId, locale, {
        ...getDefaultWordFields(
          getQuranReaderStylesInitialState(locale).quranFont,
        ),
        mushaf: defaultMushafId,
        perPage: 1000,
        translations: translationList,
        // from: firstPageOfJuzLookup.from,
        // to: firstPageOfJuzLookup.to,
      });

      const metaData = {numberOfVerses};
      juzVersesResponse.metaData = metaData;
      juzVersesResponse.pagesLookup = pagesLookupResponse;

      dispatch(setVerseList(juzVersesResponse));
      setVerseDetailList(juzVersesResponse?.verses);
      setShowLoader(false);

      return {
        props: {
          chaptersData,
          juzVerses: juzVersesResponse,
        },
        revalidate: ONE_WEEK_REVALIDATION_PERIOD_SECONDS, // verses will be generated at runtime if not found in the cache, then cached for subsequent requests for 7 days.
      };
    } catch (error) {
      console.log('juzVerses==er', error);

      return {
        props: {
          hasError: true,
        },
        revalidate: REVALIDATION_PERIOD_ON_ERROR_SECONDS, // 35 seconds will be enough time before we re-try generating the page again.
      };
    }
  };

  const getBookmarkList = () => {
    setBookmark(bookmarksList);
  };

  const getPinAyahItem = () => {
    const pinAyah = getStorageItem('pin');
    setIsGetPinAyah(pinAyah);
  };

  const onClickPlaySetting = async () => {
    navigation.navigate('Setting', {isFromPage: false});
    setReciteModalVisible(false);

    handleStopAutoScrolling();
    onClickReturnSearch();
    stopAudioPlay();
  };
  const onClickPlayMusic = () => {
    setReciteModalVisible(true);
    handleStopAutoScrolling();
    onClickReturnSearch();
  };

  const clickOnReciter = item => {
    setReciteModalVisible(false);
    getAudioUrlData(item?.reciter_id, true);
  };
  
  const onCloseReciter = () => {
    setReciteModalVisible(false);
  };

  const onClickPlayPrevious = async () => {
    if (currentAyahIndex !== null && currentAyahIndex >= 0) {
      try {
        await TrackPlayer.stop();
        // console.log('Stopping current track');
        await TrackPlayer.skipToPrevious();
        await TrackPlayer.play();
        setIsPlaying(true);
        setCurrentAyahIndex(prev => prev - 1);
      } catch (error) {
        console.error('error---->', error);
      }
    } else {
      console.log('====No previous track available====');
    }
    handleStopAutoScrolling();
    onClickReturnSearch();
  };

  const onPressAyahPlayIcon = async trackId => {
    const Id = trackId - 1;
    // await TrackPlayer.stop();
    handleStopAutoScrolling();
    onClickReturnSearch();
    await TrackPlayer.skip(Id);
    await TrackPlayer.play();
    setIsPlay(true);
    setIsPlaying(true);
  };

  const onClickPlayCircle = () => {
    togglePlayAudio();
    setIsPlay(true);
  };

  const onClickPlayNext = async () => {
    if (
      currentAyahIndex !== null &&
      currentAyahIndex <= audioList?.length - 1
    ) {
      try {
        await TrackPlayer.stop();
        // console.log('Stopping current track');
        await TrackPlayer.skipToNext();
        await TrackPlayer.play();
        setIsPlaying(true);
        setCurrentAyahIndex(prev => prev + 1);
      } catch (error) {
        console.error('error---->', error);
      }
    } else {
      console.log('====No next track available====');
    }
    handleStopAutoScrolling();
    onClickReturnSearch();
  };

  const onClickPlayMenu = async () => {
    handleAutoScroll();
    onClickReturnSearch();
  };

  const onClickPlayBook = () => {
    setOpenAyahDetailView(!openAyahDetailView);
    handleStopAutoScrolling();
    onClickReturnSearch();
    setCurrentOffset(0);
  };

  const onClickSearchIcon = () => {
    TrackPlayer.pause();
    setIsPlaying(false);
    setSearchText('');
    setSearchModalVisible(true);
    setVerseDetailList(verseList?.verses);
  };

  const onClickReturnSearch = () => {
    setSearchText('');
    setSearchModalVisible(false);
    setVerseDetailList(verseList?.verses);
  };

  const onClickSearchQuran = () => {
    setSearchModalVisible(false);
  };
  const handleSearch = text => {
    if (text) {
      const lowerCaseText = text.toLowerCase();
      const filterVerseDetail = verseList?.verses?.filter(item => {
        // const resourceName =
        //   item?.translations[0]?.resourceName?.toLowerCase() || '';
        const verseText = item?.translations[0]?.text?.toLowerCase() || '';
        return verseText.includes(lowerCaseText);
      });
      setVerseDetailList(filterVerseDetail);
    } else {
      setVerseDetailList(verseList?.verses);
    }
  };

  const onClickPin = item => {
    setPinModalVisible(true);
    setIsPinAyahItem(item);
  };
  const onClickCancel = () => {
    setPinModalVisible(false);
    setIsPinAyahItem('');
  };

  const onClickConfirm = () => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
  });
  const currentDateTime = formatter.format(new Date());
    
    if (isPinAyahItem?.id === isGetPinAyah?.AyahItem?.id) {
      const pinItem = {};
      setStorageItem('pin', pinItem);
      setPinModalVisible(false);
      setIsGetPinAyah(pinItem);

      setAdditionalTexts(prev => {
        const newTexts = { ...prev };
        delete newTexts[isPinAyahItem.id];
        saveAdditionalTextsToStorage(newTexts);
        return newTexts;
      });

      setTimeout(() => {
        setShowPinMessage(true);
      }, 500);
      setTimeout(() => {
        setShowPinMessage(false);
      }, 3000);
    } else {
      const pinItem = {
        SurahItem: surahDetail,
        AyahItem: isPinAyahItem,
        pinnedAt: currentDateTime,
      };

      setStorageItem('pin', pinItem);
      setPinModalVisible(false);
      setIsGetPinAyah(pinItem);

      setAdditionalTexts(prev => {
        const newTexts = {};
        newTexts[isPinAyahItem.id] = currentDateTime;
        saveAdditionalTextsToStorage(newTexts); 
        return newTexts;
      });

      setTimeout(() => {
        setShowPinMessage(true);
      }, 500);
      setTimeout(() => {
        setShowPinMessage(false);
      }, 3000);
    }
  };

const saveAdditionalTextsToStorage = async (texts) => {
    setStorageItem('additionalTexts', texts);
};

useEffect(() => {
  const loadAdditionalTexts = async () => {
      const savedTexts = await getStorageItem('additionalTexts');
      if (savedTexts) {
          setAdditionalTexts(savedTexts);
      }
  };

  loadAdditionalTexts();
}, []);

  const toggleBookmark = item => {
    const Bookmark = {BookmarkSurahItem: surahDetail, BookmarkAyahItem: item};
    const isAlreadyBookmarked = isBookmark?.some(
      val => val.BookmarkAyahItem?.id === item?.id,
    );
    let updatedBookmark = [];
    if (isAlreadyBookmarked) {
      updatedBookmark = isBookmark?.filter(
        val => val.BookmarkAyahItem?.id !== item?.id,
      );
    } else {
      updatedBookmark = [Bookmark, ...isBookmark];
    }

    setBookmark(updatedBookmark);
    setStorageItem('bookmark', updatedBookmark);
  };

  const bookmarked = item => {
    return isBookmark.some(val => {
      return val?.BookmarkAyahItem?.id === item?.id;
    });
  };

  const scrollToEnd = () => {
    const scrollStep = () => {
      TrackPlayer.pause();
      setIsPlaying(false);

      if (isSpeedCounting <= 3) {
        dispatch(setSpeedCounting(isSpeedCounting + 1));
      } else {
        dispatch(setSpeedCounting(1));
        return;
      }
      const stepIncrement = isSpeedCounting * 10;
      InteractionManager.runAfterInteractions(() => {
        if (openAyahDetailView) {
          if (ayahRefs?.current) {
            if (layout?.height < currentOffset) {
              handleStopAutoScrolling();
              return;
            }
            setCurrentOffset(prevOffset => {
              const offsetValue = prevOffset + stepIncrement;
              ayahRefs.current.scrollTo({
                y: offsetValue,
                animated: true,
              });
              return offsetValue;
            });
          }
        } else {
          if (scrollingRef?.current) {
            setCurrentOffset(prevOffset => {
              const offsetValue = prevOffset + stepIncrement;
              scrollingRef.current.scrollToOffset({
                offset: offsetValue,
                animated: true,
              });
              return offsetValue;
            });
          }
        }
        animationFrameId.current = requestAnimationFrame(scrollStep);
      });
    };

    scrollStep();
  };

  const handleAutoScroll = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    scrollToEnd();
  };

  const handleStopAutoScrolling = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    setCurrentOffset(0);
    dispatch(setSpeedCounting(1));
  };

  useEffect(() => {
    if (isPlaying && currentPlayingAyah) {
      const saveCurrentAyahItem = {
        SurahItem: surahDetail,
        AyahItem: currentPlayingAyah,
      };
      setStorageItem('saveCurrentAyah', saveCurrentAyahItem);
    }
  }, [currentPlayingAyah, isPlaying]);

  useEffect(() => {
    setSelectedAyah(currentPlayingAyah);
  }, [currentPlayingAyah]);

  const onClickYes = () => {
    setLastPlayAyahVisible(false);

    navigation.push('SurahDetailPage', {
      selectedAyahItems: saveCurrentAyah?.AyahItem,
      selectedSurahItems: saveCurrentAyah?.SurahItem,
      fromBookmarkAyah: true,
      ayahIdFromBookmark: saveCurrentAyah?.AyahItem?.id,
    });
  };

  const onClickNo = () => {
    setLastPlayAyahVisible(false);
    setStorageItem('saveCurrentAyah', []);
    if (fromPlayIcon) {
      onPressAyahPlayIcon(selectedAyah?.verseNumber);
    } else {
      onClickPlayCircle();
    }
  };

  // ====== Audio Play =======
  useEffect(() => {
    TrackPlayer.addEventListener('playback-queue-ended', async () => {
      console.log('Track ended', surahDetail?.id);
      setCurrentPlayingAyah({});
      setCurrentAyahIndex(null);
      getAudioUrlData(reciters?.reciter_id, false);
      setIsPlaying(false);
    });
    const unsubscribe = navigation.addListener('blur', async () => {
      await TrackPlayer.stop();
      setIsPlaying(false);
    });
    return async () => {
      await TrackPlayer.reset();
      stopAudioPlay();
      handleStopAutoScrolling();
      dispatch(setSpeedCounting(1));
      unsubscribe();
    };
  }, []);

  const togglePlayAudio = async () => {
    if (isPlaying) {
        await TrackPlayer.pause();
        setIsPlaying(false);
    } else {
        await TrackPlayer.setRate(playbackSpeed); // Set playback speed
        await TrackPlayer.play();
        setIsPlaying(true);
    }
};

const changePlaybackSpeed = async () => {
  const newSpeed = playbackSpeed === 1.0 ? 1.5 : playbackSpeed === 1.5 ? 2.0 : 1.0;
  setPlaybackSpeed(newSpeed);
  await TrackPlayer.setRate(newSpeed);
};

  useFocusEffect(
    React.useCallback(() => {
      TrackPlayer.setupPlayer().then(() => {});
      getAudioUrlData(reciters?.reciter_id, false);
    }, []),
  );

  // const getAudioUrlData = async (reciter_id, isReset) => {
  //   let audioData = {};
  //   try {
  //     if (fromjuz) {
  //       const juzId = surahDetail?.id;
  //       audioData = await getAudioUrlByJuz(reciter_id, juzId);
  //     } else {
  //       const chapterId = surahDetail?.id;
  //       audioData = await getAudioUrlByChapter(reciter_id, chapterId);
  //     }
  //     if (audioData?.audioFiles?.length != 0) {
  //       const updatedRecitationsData = audioData?.audioFiles?.map(
  //         (item, index) => ({
  //           ...item,
  //           id: index + 1,
  //           url: `https://verses.quran.com/${item?.url}`,
  //         }),
  //       );
  //       setAudioList(updatedRecitationsData);
  //       // dispatch(setChapterAudioList(updatedRecitationsData));

  //       await TrackPlayer.stop(); // Stop previous track before playing new one
  //       await TrackPlayer.reset(); // Reset TrackPlayer instance
  //       await TrackPlayer.add(updatedRecitationsData);

  //       if (isReset) {
  //         const Id = currentAyahIndex || 0;
  //         await TrackPlayer.skip(Id);
  //         setIsPlay(true);
  //         setIsPlaying(true);
  //         await TrackPlayer.play();
  //       }
  //     } else {
  //       Alert.alert(
  //         '',
  //         'Please select other reciter ',
  //         [
  //           {
  //             text: 'OK',
  //             onPress: () => setReciteModalVisible(true),
  //             style: 'default',
  //           },
  //         ],
  //         {cancelable: false},
  //       );
  //     }
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       try {
  //         const errorData = JSON.parse(err.message.replace('API error: ', ''));
  //         errorStatus = errorData?.status;
  //         errorMessage = errorData?.error;
  //       } catch (error) {
  //         // console.error('Error error message==>', error);
  //       }
  //     }
  //     Alert.alert(
  //       '',
  //       errorMessage,
  //       [
  //         {
  //           text: 'OK',
  //           onPress: () => {
  //             if (errorStatus == 404) {
  //               setReciteModalVisible(true);
  //             }
  //           },
  //           style: 'default',
  //         },
  //       ],
  //       {cancelable: false},
  //     );
  //   }
  // };

const getAudioUrlData = async (reciter_id, isReset) => {
  let audioData = {};
  try {
      // Fetch audio data based on the current Surah
      if (fromjuz) {
          const juzId = surahDetail?.id;
          audioData = await getAudioUrlByJuz(reciter_id, juzId);
      } else {
          const chapterId = surahDetail?.id;
          audioData = await getAudioUrlByChapter(reciter_id, chapterId);
      }

      // Check if audio files exist
      if (audioData?.audioFiles?.length !== 0) {
          const updatedRecitationsData = audioData?.audioFiles?.map(
              (item, index) => ({
                  ...item,
                  id: index + 1,
                  url: `https://verses.quran.com/${item?.url}`,
              }),
          );

          // Reset TrackPlayer before adding new tracks
          await TrackPlayer.reset();
          console.log('Resetting TrackPlayer before adding new tracks');
          console.log('Adding new tracks for Surah:', surahDetail?.id);
          await TrackPlayer.add(updatedRecitationsData);

          if (isReset) {
              const Id = currentAyahIndex || 0;
              await TrackPlayer.skip(Id);
              setIsPlay(true);
              setIsPlaying(true);
              await TrackPlayer.play();
          }
      } else {
          Alert.alert(
              '',
              'Please select another reciter',
              [
                  {
                      text: 'OK',
                      onPress: () => setReciteModalVisible(true),
                      style: 'default',
                  },
              ],
              { cancelable: false },
          );
      }
  } catch (err) {
      console.error('Error fetching audio data:', err);
      Alert.alert('Error', 'There was an error fetching audio data.');
  }
};

  const playSingleAyah = async (ayahItem) => {
    try {
        const reciter_id = reciters?.reciter_id;
        const audioData = await getAudioUrlByChapter(reciter_id, ayahItem?.chapterId);
        const ayahAudio = audioData?.audioFiles?.find(audio => audio.verseKey === ayahItem.verseKey);
        if (ayahAudio) {
          let url = ayahAudio.url;
          const isUrlContainsDotCom = url.includes('.com');
          if (isUrlContainsDotCom) {
            if (url.startsWith('//')) {
            const updatedAudio = {
                url :  `https:${url}`,
                title: `Ayah ${ayahItem.verseNumber}`, // Set the title for the track
            };
                        
            await TrackPlayer.stop(); // Stop previous track before playing new one
            await TrackPlayer.reset();
            await TrackPlayer.add(updatedAudio);
            await TrackPlayer.play(); // Play the audio
            setCurrentAyahIndex(ayahItem.verseNumber); // Update the current Ayah index         
            }
          } else {
            const updatedAudio = {
                url : `https://verses.quran.com/${ayahAudio.url}`,
                title: `Ayah ${ayahItem.verseNumber}`,
          };

          await TrackPlayer.stop(); // Stop previous track before playing new one
          await TrackPlayer.reset();
          await TrackPlayer.add(updatedAudio);
          await TrackPlayer.play(); // Play the audio
          setCurrentAyahIndex(ayahItem.verseNumber); // Update the current Ayah index     
          }
        } else {
            Alert.alert('Audio not found', 'The audio for this Ayah is not available.');
        }
    } catch (error) {
        console.error('Error playing Ayah:', error);
        Alert.alert('Error', 'There was an error trying to play this Ayah.');
    }
};

  //=== get current play Ayah===
  useEffect(() => {
    const fetchCurrentTrackIndex = async () => {
      if (isPlay && isPlaying) {
        const currentTrackItem = await TrackPlayer.getActiveTrack();

        if (currentTrackItem) {
          setCurrentPlayingAyah(currentTrackItem);
          const trackId = currentTrackItem?.id;
          setCurrentAyahIndex(trackId);
          const currentIndex = trackId - 1;
          if (!openAyahDetailView) {
            if (currentIndex && scrollingRef?.current) {
              scrollingRef?.current?.scrollToIndex({index: currentIndex});
              // scrollToCurrentAyah(currentIndex)
            }
          }
        } else {
          setCurrentPlayingAyah({});
          setCurrentAyahIndex(null);
        }

        const index = audioList?.findIndex(
          item => item?.id === currentTrackItem?.id,
        );

        const scrollIndex = Math.round(
          layout?.height / (audioList?.length + 1),
        );

        const scrollingIndex = scrollIndex * index + 2;
        scrollToCurrentAyah(scrollingIndex);
      }
    };
    fetchCurrentTrackIndex();
  }, [progress?.position, isPlay, isPlaying]);

  // ===Play from Bookmark===
  useEffect(() => {
    if (
      ayahIdFromBookmark &&
      !isEmpty(audioList) &&
      verseDetailList?.length != 0 &&
      !showLoader
    ) {
      const playBookmarkAyah = async () => {
        const Id = ayahIdFromBookmark - 1;
        await TrackPlayer.skip(Id);
        await TrackPlayer.play();
        setIsPlay(true);
        setIsPlaying(true);
      };
      playBookmarkAyah();
    }
  }, [route?.params, verseDetailList, audioList, showLoader]);

  // ===Play from Pin===
  useEffect(() => {
    if (
      !showLoader &&
      fromPinAyah &&
      verseDetailList?.length &&
      verseDetailList[selectedAyahItems?.verseNumber - 1].verseNumber ===
        selectedAyahItems?.verseNumber
    ) {
      setTimeout(() => {
        const scrollToIndex = selectedAyahItems?.verseNumber - 1;
        if (scrollingRef.current) {
          scrollingRef.current.scrollToIndex({
            index: scrollToIndex,
            animated: true,
          });
        }
      }, 500);
    }
  }, [verseDetailList, showLoader]);

  const seekTo = async value => {
    await TrackPlayer?.seekTo(value);
  };

  const stopAudioPlay = async () => {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
    setIsPlaying(false);
  };

  const shareMessage = async item => {
    const Ayah = item?.textUthmani;

    const transliteration = item?.words
      ?.map(item => (item?.transliteration?.text || '').replace(/null/g, ''))
      .join(' ');

    const translations = item?.translations[0]?.text?.replace(
      /<sup[^>]*>.*?<\/sup>/g,
      '',
    );
    try {
      const message = `Ayah: ${Ayah} \nTransliteration: ${transliteration} \nTranslations: ${translations}`;
      const options = {
        title: 'Quran',
        message: message,
      };
      const result = await Share.open(options);
      console.log(result);
    } catch (error) {
      console.log('Error sharing:', error.message);
    }
  };

  const versesItemRenderItem = ({item, index}) => {
    const checkIsPin = item?.id == isGetPinAyah?.AyahItem?.id;
    const lightYellowBackground = checkIsPin ? COLORS.SlateYellow : COLORS.gray;
    const pinColor = checkIsPin ? COLORS.yellow : COLORS.thirdGray;
    const skyBlueBackground =
      index + 1 == currentAyahIndex ? COLORS.skyBlue : COLORS.white;
    const skyBlueTextColor =
      index + 1 == currentAyahIndex ? COLORS.darkblue : COLORS.black;
    return (
      <View
        key={item?.id}
        style={{
          paddingBottom:
            index === verseDetailList?.length - 1
              ? isPlaying
                ? '30%'
                : '20%'
              : 0,
        }}>
        <TopRowComponent
          index={index}
          item={item}
          surahDetail={surahDetail}
          currentAyahIndex={currentAyahIndex}
          isGetPinAyah={isGetPinAyah}
          isBookIcon={true}
          onPressBookIcon={() => {
            navigation?.navigate('AddTafseer', {verseKey: item?.verseKey});
            onClickReturnSearch();
          }}
          onPresShareIcon={() => {
            shareMessage(item);
            onClickReturnSearch();
          }}
          onPressPlayIcon={async () => {
            setFromPlayIcon(false);
            setSelectedAyah(item);
            if (!global.isFirstTime) {
              if (!isEmpty(saveCurrentAyah)) {
                await playSingleAyah(item); 
              } else {
                await playSingleAyah(item); 
              }
            } else {
              await playSingleAyah(item); 
            }  
          }}
          saveBookmark={bookmarked(item)}
          onPressBookmarkIcon={() => {
            toggleBookmark(item);
          }}
          topViewCustomeStyle={{
            backgroundColor: lightYellowBackground,
          }}
          isLeftPinIcon={true}
          pinIconCustomeStyle={{
            tintColor: pinColor,
          }}
          onPressPinIcon={() => {
            onClickPin(item);
          }}
          additionalText={additionalTexts[item.id] || ''} 
        />

        <AyahViewComponent
          ayahItem={item}
          detailContainerCustomeStyle={{backgroundColor: skyBlueBackground}}
          detailTextCustomeStyle={{color: skyBlueTextColor}}
          searchingText={searchText}
          currentAyahIndex={currentAyahIndex}
          index={index}
        />
      </View>
    );
  };

  const isReachedEnd = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const scrollToCurrentAyah = index => {
    if (ayahRefs?.current) {
      ayahRefs?.current.scrollTo({
        y: index,
        animated: true,
      });
    }
  };
  return (
    
    <View style={styles.safeAreaView}>
      <Header
        title={
          fromjuz ? surahDetail?.juzNumber : surahDetail?.transliteratedName
        }
        onPressLeftIcon={() => {
          if (openAyahDetailView) {
            setOpenAyahDetailView(false);
            handleStopAutoScrolling();
            onClickReturnSearch();
            setCurrentOffset(0);
          } else {
            if (fromBookmarkAyah) {
              navigation?.navigate('DashBoard');
            } else {
              navigation.navigate('DashBoard', {
                tabIndex: 0,
              });
            }
            stopAudioPlay();
          }
        }}
        onPressRightIcon={() => {
          onClickSearchIcon();
        }}
      />
      {showLoader ? (
        <View style={styles?.loaderViewStyle}>
          <ActivityIndicator size="large" color={COLORS.primaryBlue} />
        </View>
      ) : (
        <>
        
              {!openAyahDetailView ? (
              <>
              {!fromjuz && (
                <View style={styles.topMainView}>
                  <View style={styles.leftTextView}>
                    <View style={styles.topviewStyle}>
                      <Text style={styles.titleText}>
                        {surahDetail?.transliteratedName}
                      </Text>
                    </View>
                    <View style={styles.topviewStyle}>
                      <Text style={styles.subText}>
                        {surahDetail?.translatedName}
                      </Text>
                    </View>
                    <View style={styles.topviewStyle}>
                      <Text
                        style={
                          styles.subText
                        }>{`Reveled: ${surahDetail?.revelationPlace}`}</Text>
                    </View>
                    <View style={styles.topviewStyle}>
                      <Text
                        style={
                          styles.subText
                        }>{`Total Ayahs: ${surahDetail?.versesCount}`}</Text>
                    </View>
                  </View>
                  <View style={styles.rightViewStyle}>
                    <View style={styles?.container}>
                      <Text
                        style={[
                          styles.rightTitleText,
                          {
                            ...FONTSTYLE(
                              Platform.OS === 'android'
                                ? isArabicFont?.key
                                : FONTS[isArabicFont?.key],
                            ).bigTitle,
                            lineHeight: Platform.OS === 'android' ? 45 : 0,
                          },
                        ]}>
                         سورة {ar[surahDetail?.id]?.transliteratedName}
                      </Text>
                    </View>
                    <View style={styles.rigntImageView}>
                      {surahDetail?.revelationPlace == 'makkah' ? (
                        <Image
                          style={styles.rightIconStyle}
                          source={IMAGES.makkahIcon}
                        />
                      ) : surahDetail?.revelationPlace == 'madinah' ? (
                        <Image
                          style={styles.rightIconStyle}
                          source={IMAGES.medinanIcon2}
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
              )}
              <View style={{flex: 1}}>
                <FlashList
                  ref={scrollingRef}
                  data={verseDetailList}
                  renderItem={versesItemRenderItem}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item?.id.toString()}
                  estimatedItemSize={500}
                  estimatedListSize={{
                    height: SIZES.height,
                    width: SIZES.width,
                  }}
                  getItemType={({item}) => {
                    return item;
                  }}
                  onEndReached={() => {
                    handleStopAutoScrolling();
                    setCurrentOffset(0);
                  }}
                  ListEmptyComponent={
                    <View style={styles.emptyViewStyle}>
                      <EmptyView />
                    </View>
                  }
                  onEndReachedThreshold={0.01}
                  extraData={{
                    isBookmark,
                    isPinAyahItem,
                    pinModalVisible,
                    isGetPinAyah,
                    currentAyahIndex,
                    currentPlayingAyah,
                    isPlay,
                    isSpeedCounting,
                  }}
                />
              </View>
              </>
              ) : (
              <View style={{flex: 1}}>
             
             {!fromjuz && (
                <View style={styles.topMainView}>
                  <View style={styles.leftTextView}>
                    <View style={styles.topviewStyle}>
                      <Text style={styles.titleText}>
                        {surahDetail?.transliteratedName}
                      </Text>
                    </View>
                    <View style={styles.topviewStyle}>
                      <Text style={styles.subText}>
                        {surahDetail?.translatedName}
                      </Text>
                    </View>
                    <View style={styles.topviewStyle}>
                      <Text
                        style={
                          styles.subText
                        }>{`Reveled: ${surahDetail?.revelationPlace}`}</Text>
                    </View>
                    <View style={styles.topviewStyle}>
                      <Text
                        style={
                          styles.subText
                        }>{`Total Ayahs: ${surahDetail?.versesCount}`}</Text>
                    </View>
                  </View>
                  <View style={styles.rightViewStyle}>
                    <View style={styles?.container}>
                      <Text
                        style={[
                          styles.rightTitleText,
                          {
                            ...FONTSTYLE(
                              Platform.OS === 'android'
                                ? isArabicFont?.key
                                : FONTS[isArabicFont?.key],
                            ).bigTitle,
                            lineHeight: Platform.OS === 'android' ? 45 : 0,
                          },
                        ]}>
                         سورة {ar[surahDetail?.id]?.transliteratedName}
                      </Text>
                    </View>
                    <View style={styles.rigntImageView}>
                      {surahDetail?.revelationPlace == 'makkah' ? (
                        <Image
                          style={styles.rightIconStyle}
                          source={IMAGES.makkahIcon}
                        />
                      ) : surahDetail?.revelationPlace == 'madinah' ? (
                        <Image
                          style={styles.rightIconStyle}
                          source={IMAGES.medinanIcon2}
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
              )}              
              <ImageBackground
                source={IMAGES.backGroundImgOne}
                resizeMode="cover"
                style={styles.backgroundImageStyle}>
                <View
                  style={[
                    styles.ayahMainView,
                    {
                      paddingBottom:
                        HEIGHT - 180 <= layout?.height
                          ? isPlaying
                            ? verticalScale(80)
                            : verticalScale(50)
                          : 0,
                    },
                  ]}
                  onLayout={handleLayout}>
                   <ScrollView
                   style={{padding: 2,}}
                    showsVerticalScrollIndicator={false}
                    ref={ayahRefs}
                    scrollEventThrottle={16} 
                    onScroll={({nativeEvent}) => {
                      if (isReachedEnd(nativeEvent)) {
                        handleStopAutoScrolling();
                      }
                    }}>                 
                  <View>
  <Text
    style={{textAlign: "justify" }}
    adjustsFontSizeToFit
  >
    {verseDetailList &&
      verseDetailList.map((item, index) => {
        return (
          <React.Fragment key={index}>
            <Text
              key={index}
              style={{
                ...FONTSTYLE(
                  Platform.OS === "android"
                    ? isArabicFont?.key
                    : FONTS[isArabicFont?.key],
                  arabicFontSize
                ).arabicText,
                color:
                  currentAyahIndex === index + 1
                    ? COLORS?.yellow
                    : COLORS?.primaryGray,
              }}
            >
              {item?.textUthmani}
            </Text>
            <Text
              style={[
                {
                  ...FONTSTYLE(
                    FONTS.trochutBold,
                    arabicFontSize *
                      (item?.id < 100
                        ? 0.5
                        : item?.id < 1000
                        ? 0.4
                        : 0.3)
                  ).arabicText,
                  color:
                    currentAyahIndex === index + 1
                      ? COLORS?.yellow
                      : COLORS?.primaryGray,
                  position: "absolute",
                },
                styles.numberTextStyle,
              ]}
            >
              {" "}
              ﴿{item?.verseKey.split(":")[1]}﴾{" "}
            </Text>

          </React.Fragment>
        );
      })}
  </Text>
</View>
                  </ScrollView>
                </View>
              </ImageBackground>
              </View>
              )}
                           
              {isPlay && (
              <View>
              <BottomView
                onPressPlaySetting={onClickPlaySetting}
                onPressPlayMusic={onClickPlayMusic}
                onPressPlayPrevious={onClickPlayPrevious}
                playImageSource={
                  isPlaying ? IMAGES.playOnIcon : IMAGES.playOffIcon
                }
                onPressPlayCircle={() => {
                  setFromPlayIcon(false);
                  if (!global.isFirstTime && !isPlaying) {
                    global.isFirstTime = true;
                    if (!isEmpty(saveCurrentAyah)) {
                      setLastPlayAyahVisible(true);
                    } else {
                      onClickPlayCircle();
                    }
                  } else {
                    // global.isFirstTime = false;
                    onClickPlayCircle();
                  }
                  handleStopAutoScrolling();
                  onClickReturnSearch();
                }}
                onPressPlayNext={onClickPlayNext}
                onPressPlayMenu={onClickPlayMenu}
                onPressPlayBook={onClickPlayBook}
                minimumValue={0}
                maximumValue={progress?.duration}
                value={progress?.position}
                onSlidingComplete={seekTo}
                isVisibleSpeedIcon={isSpeedCounting == 1 ? true : false}
                isPlay={isPlaying}
                openAyahDetailView={openAyahDetailView}
                disabled={
                  openAyahDetailView
                    ? HEIGHT - 140 <= layout?.height
                      ? false
                      : true
                    : false
                }
              />
              </View>
              )}
              {showPinMessage && (
              <View>
              <PinMessage
                pinText={
                  isPinAyahItem?.id == isGetPinAyah?.AyahItem?.id ? true : false
                }
                pinItem={isPinAyahItem}
              />
              </View>
              )}
              {isPlaying &&(
               <View style = {{resizeMode:"contain",top:600,right:35,alignSelf:"flex-end",width:50,height:50,position:"absolute"}}>
                <TouchableOpacity style={styles.fab} onPress={changePlaybackSpeed}>
                  <Text style={styles.fabText}>{playbackSpeed}x</Text>
                </TouchableOpacity>
                </View>
                )}
            </>
        )}

      <SearchModalComponent
        visible={searchModalVisible}
        title="Search"
        subtitle="Note: Typing on the search field will auto search the surah by
          name."
        searchText={searchText}
        onChangeText={text => {
          handleSearch(text);
          setSearchText(text);
        }}
        onClickSearch={() => {
          onClickSearchQuran();
        }}
        onClickReturn={() => {
          onClickReturnSearch();
        }}
      />
      <ModalComponent
        visible={pinModalVisible}
        title={
          isPinAyahItem?.id == isGetPinAyah?.AyahItem?.id
            ? 'Would you Like to Remove This Ayah from Pinned?'
            : 'Would You Like to Pin This Ayah?'
        }
        subtitle={
          isPinAyahItem?.id == isGetPinAyah?.AyahItem?.id
            ? 'Removing this ayah will delete it from your pinned list.'
            : 'Pinning this ayah allows for easy access in the future.'
        }
        onClickClose={() => {
          onClickCancel();
        }}
        onClickConfirm={() => {
          onClickConfirm();
        }}
        cancelButtonText={'Cancel'}
        confirmButtonText={
          isPinAyahItem?.id == isGetPinAyah?.AyahItem?.id ? 'Delete' : 'Confirm'
        }
      />
      <ModalComponent
        visible={lastPlayAyahVisible}
        subtitle="Would you like to play the last played Ayah?"
        onClickClose={() => {
          onClickNo();
        }}
        onClickConfirm={() => {
          onClickYes();
        }}
        cancelButtonText={'No'}
        confirmButtonText={'Yes'}
      />
      <ReciterModal
        data={recitersList}
        visible={reciteModalVisible}
        clickOnReciter={item => {
          clickOnReciter(item);
        }}
        onClose={() => {
          onCloseReciter();
        }}
      />
    </View>
  );
};
const styles = ScaledSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.gray,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    height: '45@s',
  },
  topMainView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: '10@s',
    paddingHorizontal: '15@s',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  topviewStyle: {top:3},
  leftTextView: {width: '35%', marginRight: '3@s'},
  titleText: {
    ...FONTSTYLE(FONTS.poppinsMedium).inputs,
    color: COLORS.primaryBlue,
  },
  subText: {
    ...FONTSTYLE(FONTS.poppinsRegular).smallText,
    color: COLORS.primaryGray,
  },
  rightViewStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rightIconStyle: {
    height: '45@s',
    width: '45@s',
    resizeMode: 'contain',
  },
  rigntImageView: {marginLeft: '5@s'},
  rightTitleText: {
    textAlign: 'right',
    color: COLORS.black,
  },
  backgroundImageStyle: {
    resizeMode: 'contain',
    flex: 1,
  },
  ayahMainView: {
    margin: '15@s',
    borderRadius: 20,
    backgroundColor: COLORS.white,
    paddingHorizontal: '10@s',
    alignItems: 'center',
    paddingTop: '2@s',  
  },
  subTextView: {
    paddingTop: '5@s',
  },
  loaderViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  numberTextStyle: {top: '3@s'},
  emptyViewStyle: {marginTop: SIZES.height / 3},
  fab: {
    backgroundColor: '#6200ee',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});


export default SurahDetailPage;
