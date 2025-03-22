import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import NeshineFavouritesScreen from './NeshineFavouritesScreen';
import NeshineMapScreen from './NeshineMapScreen';

import mysticWondersData from '../components/mysticWondersData';
import goldenHeritageData from '../components/goldenHeritageData';
import sunsetSerenityData from '../components/sunsetSerenityData';
import localDelightsData from '../components/localDelightsData';
import Loader from '../components/Loader';
import GalleryScreen from './GalleryScreen';
import NeshineBlogScreen from './NeshineBlogScreen';
import WelcomePageScreen from './WelcomePageScreen';
import NeshineQuizzScreen from './NeshineQuizzScreen';
import LoadingNeshineScreen from './LoadingNeshineScreen';

const fontKarlaRegular = 'Karla-Regular';
const fontKarlaExtraLight = 'Karla-ExtraLight';

const galeryData = [{ id: 13, image: require('../assets/images/neshinePlacesImages/galleryImage.png'), title: 'Baloons in the sky' }, ...goldenHeritageData, ...localDelightsData, ...mysticWondersData, ...sunsetSerenityData];

const bottomBtns = [
  {
    id: 4,
    screen: 'NeshineFavorites',
    whiteCulinaryIcon: require('../assets/icons/inappIcons/savedIcon.png'),
    goldCulinaryIcon: require('../assets/icons/blackInappIcons/savedIcon.png'),
    neshineUpTitle: 'Saved'
  },
  {
    id: 3,
    screen: 'NeshineMap',
    whiteCulinaryIcon: require('../assets/icons/inappIcons/mapIcon.png'),
    goldCulinaryIcon: require('../assets/icons/blackInappIcons/mapIcon.png'),
    neshineUpTitle: 'Interactive Map'
  },
  {
    id: 1,
    screen: 'Home',
    whiteCulinaryIcon: require('../assets/icons/inappIcons/starIcon.png'),
    goldCulinaryIcon: require('../assets/icons/blackInappIcons/starIcon.png'),
    neshineUpTitle: 'Shine Spots✨'
  },

  {
    id: 2,
    screen: 'NeshineBlog',
    whiteCulinaryIcon: require('../assets/icons/inappIcons/blogIcon.png'),
    goldCulinaryIcon: require('../assets/icons/blackInappIcons/blogIcon.png'),
    neshineUpTitle: 'Cultural Blog'
  },
  {
    id: 5,
    screen: 'GalleryScreen',
    whiteCulinaryIcon: require('../assets/icons/inappIcons/galeryIcon.png'),
    goldCulinaryIcon: require('../assets/icons/blackInappIcons/galeryIcon.png'),
    neshineUpTitle: 'Photogallery'
  },
]

const neshineCategoryButtons = [
  {
    id: 1,
    title: 'Golden Heritage',
    image: require('../assets/images/categoryImages/catImg1.png'),
  },
  {
    id: 2,
    title: 'Mystic Wonders',
    image: require('../assets/images/categoryImages/catImg2.png'),
  },
  {
    id: 3,
    title: 'Sunset Serenity',
    image: require('../assets/images/categoryImages/catImg3.png'),
  },
  {
    id: 4,
    title: 'Local Delights',
    image: require('../assets/images/categoryImages/catImg4.png'),
  },
]

const HomeScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedNeshineScreen, setSelectedNeshineScreen] = useState('LoadingNeshine');
  const [selectedNeshineCategory, setSelectedNeshineCategory] = useState(null);
  const [savedNeshinePlaces, setSavedNeshinePlaces] = useState([]);
  const [isNeshineMapPlaceVisible, setIsNeshineMapPlaceVisible] = useState(false);
  const [generatedNeshinePlace, setGeneratedNeshinePlace] = useState(null);
  const [selectedNeshinePlace, setSelectedNeshinePlace] = useState(null);
  const [isGeneratingNeshinePlace, setIsGeneratingNeshinePlace] = useState(false);
  const [neshineDots, setNeshineDots] = useState('');
  const [isNeshineQuizStarted, setIsNeshineQuizStarted] = useState(false);
  const [isNeshineWelcomeWasVisible, setIsNeshineWelcomeWasVisible] = useState(false);
  const [availableUntil, setAvailableUntil] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [prevGeneratedNeshinePlace, setPrevGeneratedNeshinePlace] = useState(null);

  const isQuizAvailable = availableUntil === null;

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const finishTimeStr = await AsyncStorage.getItem('quizFinishTime');
        if (finishTimeStr) {
          const finishTime = new Date(finishTimeStr);
          const today = new Date();

          if (
            finishTime.getDate() === today.getDate() &&
            finishTime.getMonth() === today.getMonth() &&
            finishTime.getFullYear() === today.getFullYear()
          ) {
            const nextMidnight = new Date(today);
            nextMidnight.setDate(today.getDate() + 1);
            nextMidnight.setHours(0, 0, 0, 0);

            if (Date.now() < nextMidnight.getTime()) {
              setAvailableUntil(nextMidnight.getTime());
            } else {
              setAvailableUntil(null);
            }
          } else {
            setAvailableUntil(null);
          }
        } else {
          setAvailableUntil(null);
        }
      } catch (error) {
        console.error('Error checking quiz availability:', error);
      }
    };

    checkAvailability();

    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
      checkAvailability();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [selectedNeshineScreen]);

  useEffect(() => {
    const loadNeshineWelcome = async () => {
      try {

        const isNeshineWelcomeWasVisible = await AsyncStorage.getItem('isNeshineWelcomeWasVisible');

        if (isNeshineWelcomeWasVisible) {
          setIsNeshineWelcomeWasVisible(false);
        } else {
          setSelectedNeshineScreen('WelcomePage');
          setIsNeshineWelcomeWasVisible(true);
          await AsyncStorage.setItem('isNeshineWelcomeWasVisible', 'true');
        }
      } catch (error) {
        console.error('Error loading of neshine welcome', error);
      }
    };
    loadNeshineWelcome();
  }, []);

  const loadCulinaryRestaurats = async () => {
    try {
      const storedNeshinePlaces = await AsyncStorage.getItem('savedNeshinePlaces');
      const parsedNeshinePlaces = storedNeshinePlaces ? JSON.parse(storedNeshinePlaces) : [];
      setSavedNeshinePlaces(parsedNeshinePlaces);
    } catch (error) {
      console.error('Error loading savedNeshinePlaces:', error);
    }
  };

  useEffect(() => {
    loadCulinaryRestaurats();
  }, []);

  const getShineDataByCategory = (activityCtgr) => {
    switch (activityCtgr) {
      case 'Golden Heritage':
        return goldenHeritageData;
      case 'Mystic Wonders':
        return mysticWondersData;
      case 'Sunset Serenity':
        return sunsetSerenityData;
      case 'Local Delights':
        return localDelightsData;
      default:
        return [];
    }
  };

  const shinesData = getShineDataByCategory(selectedNeshineCategory?.title);

  const isNeshinePlaceSaved = (shinePlace) => {
    return savedNeshinePlaces.some((nPlace) => nPlace.id === shinePlace?.id);
  };

  const saveNeshinePlace = async (neshinePlace) => {
    try {
      const savedNeshinePlace = await AsyncStorage.getItem('savedNeshinePlaces');
      const parsedNeshinePlaces = savedNeshinePlace ? JSON.parse(savedNeshinePlace) : [];

      const thisShinePlaceIndex = parsedNeshinePlaces.findIndex((r) => r.id === neshinePlace.id);

      if (thisShinePlaceIndex === -1) {
        const updatedShinePlaces = [neshinePlace, ...parsedNeshinePlaces];
        await AsyncStorage.setItem('savedNeshinePlaces', JSON.stringify(updatedShinePlaces));
        setSavedNeshinePlaces(updatedShinePlaces);
      } else {
        const updatedShinePlaces = parsedNeshinePlaces.filter((r) => r.id !== neshinePlace.id);
        await AsyncStorage.setItem('savedNeshinePlaces', JSON.stringify(updatedShinePlaces));
        setSavedNeshinePlaces(updatedShinePlaces);
      }
    } catch (error) {
      console.error('error of save/delete shine place:', error);
    }
  };

  const handleGenerateShinePlace = () => {
    setIsGeneratingNeshinePlace(true);
    let randomShinePlace;
    if (shinesData.length === 0) return;
    do {
      const randomIndex = Math.floor(Math.random() * shinesData.length);
      randomShinePlace = shinesData[randomIndex];
    } while (prevGeneratedNeshinePlace && randomShinePlace.id === prevGeneratedNeshinePlace.id);
    setGeneratedNeshinePlace(randomShinePlace);
    setSelectedNeshinePlace(randomShinePlace);
    setPrevGeneratedNeshinePlace(randomShinePlace);
    setTimeout(() => {
      setIsGeneratingNeshinePlace(false);
    }, 1000);
  };

  const shareNeshinePlace = async (title) => {
    try {
      await Share.share({
        message: `Let's go to the restaurant ${title}! I found it on the NeShine - Nevşehir Shine!`,
      });
    } catch (error) {
      console.error('Error share:', error);
    }
  };

  useEffect(() => {
    const intervalNeshine = setInterval(() => {
      setNeshineDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 250);

    return () => clearInterval(intervalNeshine);
  }, []);

  useEffect(() => {
    setIsNeshineQuizStarted(false);
  }, [selectedNeshineScreen])

  return (
    <View style={{
      backgroundColor: '#171717',
      flex: 1,
      width: dimensions.width,
      height: dimensions.height,
    }}>
      {selectedNeshineScreen !== 'LoadingNeshine' && (
        <View style={{
          width: dimensions.width,
          justifyContent: 'space-between',
          backgroundColor: '#0C0C0C',
          alignItems: 'center',
          alignSelf: 'center',
          flexDirection: 'row',
          borderBottomRightRadius: dimensions.width * 0.05,
          height: dimensions.height * 0.143,
          shadowColor: '#FDCC06',
          borderBottomLeftRadius: dimensions.width * 0.05,
          paddingTop: dimensions.height * 0.04,
          shadowOffset: { width: 0, height: dimensions.height * 0.0019 },
          shadowRadius: dimensions.height * 0.0001,
          paddingHorizontal: dimensions.width * 0.05,
          shadowOpacity: 1,
        }}>
          <TouchableOpacity
            onPress={() => {
              setSelectedNeshineScreen('WelcomePage');
            }}
            style={{
              width: dimensions.width * 0.143,
              height: dimensions.width * 0.143,
              borderRadius: dimensions.width * 0.04,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selectedNeshineScreen === 'WelcomePage' ? '#FDCC06' : 'transparent',
              borderColor: 'white',
              borderWidth: selectedNeshineScreen === 'WelcomePage' ? 0 : dimensions.width * 0.003,
            }}>
            <Image
              source={selectedNeshineScreen === 'WelcomePage'
                ? require('../assets/icons/blackInappIcons/homeIcon.png')
                : require('../assets/icons/inappIcons/homeIcon.png')
              }
              style={{
                width: dimensions.width * 0.061,
                height: dimensions.width * 0.061,
                alignSelf: 'center',
              }}
              resizeMode='contain'
            />

          </TouchableOpacity>

          <Text
            style={{
              marginTop: dimensions.height * 0.007,
              fontSize: dimensions.width * 0.059,
              fontFamily: fontKarlaRegular,
              fontWeight: 600,
              color: 'white',
              textAlign: 'center',
              alignSelf: 'center',
              flex: 1,
              alignSelf: 'center',
            }}>
            {
              selectedNeshineScreen === 'WelcomePage'
                ? 'Welcome Page'
                : selectedNeshineScreen === 'NeshineQuiz'
                  ? 'Shine quiz'
                  : bottomBtns.find(button => button.screen === selectedNeshineScreen)?.neshineUpTitle
            }
          </Text>

          <TouchableOpacity
            onPress={() => {
              setSelectedNeshineScreen('NeshineQuiz')
            }}
            style={{
              width: dimensions.width * 0.143,
              height: dimensions.width * 0.143,
              borderRadius: dimensions.width * 0.04,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selectedNeshineScreen === 'NeshineQuiz' ? '#FDCC06' : 'transparent',
              borderColor: 'white',
              borderWidth: selectedNeshineScreen !== 'NeshineQuiz' ? dimensions.width * 0.003 : 0,
            }}>
            <Image
              source={selectedNeshineScreen === 'NeshineQuiz'
                ? require('../assets/icons/blackInappIcons/quizIcon.png')
                : require('../assets/icons/inappIcons/quizIcon.png')
              }
              style={{
                width: dimensions.width * 0.061,
                height: dimensions.width * 0.061,
                alignSelf: 'center',
              }}
              resizeMode='contain'
            />
            {selectedNeshineScreen !== 'NeshineQuiz' && (
              <View style={{
                width: dimensions.width * 0.143,
                borderRadius: dimensions.width * 0.5,
                backgroundColor: '#FDCC06',
                position: 'absolute',
                bottom: -dimensions.height * 0.007,

              }}>
                <Text
                  style={{
                    fontSize: dimensions.width * 0.028,
                    fontFamily: fontKarlaRegular,
                    fontWeight: 400,
                    color: 'black',
                    textAlign: 'center',
                    alignSelf: 'center',
                    paddingVertical: dimensions.height * 0.0024,
                  }}>
                  {isQuizAvailable ? 'Available' : '23:59'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
      {selectedNeshineScreen === 'Home' ? (
        <SafeAreaView style={{
          flex: 1,
          paddingHorizontal: dimensions.width * 0.05,
          width: dimensions.width,
        }}>
          {!isGeneratingNeshinePlace ? (
            <>
              {!generatedNeshinePlace ? (
                <View >
                  <Text
                    style={{
                      marginTop: dimensions.height * 0.03,
                      fontSize: dimensions.width * 0.064,
                      fontFamily: fontKarlaRegular,
                      fontWeight: 500,
                      color: 'white',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    Choose your Shine
                  </Text>
                  <Text
                    style={{
                      marginTop: dimensions.height * 0.01,
                      fontSize: dimensions.width * 0.04,
                      fontFamily: fontKarlaRegular,
                      fontWeight: 400,
                      color: '#C9C9C9',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    Tap on the category to explore Nevşehir
                  </Text>

                  <View style={{
                    width: dimensions.width * 0.9,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.019,
                  }}>
                    {neshineCategoryButtons.map((category, index) => (
                      <TouchableOpacity
                        onPress={() => { setSelectedNeshineCategory(category) }}
                        key={index} style={{
                          borderRadius: dimensions.width * 0.05,
                          borderColor: selectedNeshineCategory === category ? '#F15257' : 'transparent',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: dimensions.width * 0.44,
                          marginBottom: dimensions.width * 0.04,
                          shadowColor: '#FDCC06',
                          shadowOffset: { width: 0, height: dimensions.height * 0.0021 },
                          shadowOpacity: selectedNeshineCategory === category ? 0.55 : 0,
                          shadowRadius: dimensions.width * 0.03,
                          elevation: 5,
                        }}>
                        <Image
                          source={category.image}
                          style={{
                            width: dimensions.width * 0.43,
                            height: dimensions.width * 0.43,
                            textAlign: 'center',
                            borderColor: selectedNeshineCategory === category ? '#FDCC06' : 'white',
                            borderWidth: dimensions.width * 0.005,
                            borderRadius: dimensions.width * 0.05,

                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      handleGenerateShinePlace();
                    }}
                    style={{
                      height: dimensions.height * 0.07,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      borderRadius: dimensions.width * 0.5,
                      opacity: selectedNeshineCategory === '' || !selectedNeshineCategory ? 0.5 : 1,
                      shadowColor: '#FDCC06',
                      shadowOffset: { width: 0, height: dimensions.height * 0.0021 },
                      shadowOpacity: 0.4,
                      shadowRadius: dimensions.width * 0.03,
                      elevation: 5,
                    }}
                    disabled={selectedNeshineCategory === '' || !selectedNeshineCategory}
                  >
                    <LinearGradient
                      colors={['#FFF0B5', '#FDCC06']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{
                        borderRadius: dimensions.width * 0.5,
                        width: dimensions.width * 0.9,
                        height: dimensions.height * 0.064,
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fontKarlaRegular,
                          color: 'black',
                          fontSize: dimensions.width * 0.05,
                          textAlign: 'center',
                          fontWeight: 600,
                          zIndex: 10
                        }}>
                        Explore
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{
                  width: '100%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 100,
                  position: 'absolute',
                  marginTop: dimensions.height * 0.01,
                }}>
                  <View style={{
                    width: dimensions.width * 0.9,
                    borderRadius: dimensions.width * 0.037,
                    backgroundColor: '#181818',
                    marginTop: dimensions.height * 0.021,
                    alignSelf: 'center',
                    shadowOffset: {
                      width: 0,
                      height: dimensions.height * 0.007,
                    },
                    shadowColor: '#111',
                    elevation: 7,
                    shadowRadius: dimensions.width * 0.03,
                    borderColor: 'white',
                    shadowOpacity: 0.88,
                    borderWidth: dimensions.width * 0.003,
                  }}>
                    <Image
                      source={generatedNeshinePlace?.image}
                      style={{
                        width: '100%',
                        borderTopLeftRadius: dimensions.width * 0.037,
                        borderTopRightRadius: dimensions.width * 0.037,
                        height: dimensions.height * 0.241,
                      }}
                      resizeMode="stretch"
                    />
                    <View style={{
                      alignItems: 'center',
                      alignSelf: 'center',
                      padding: dimensions.width * 0.05,
                    }}>
                      <Text
                        style={{
                          alignSelf: 'flex-start',
                          color: 'white',
                          alignItems: 'center',
                          textAlign: "left",
                          fontSize: dimensions.width * 0.053,
                          fontWeight: 600,
                          fontFamily: fontKarlaRegular,
                          justifyContent: 'center',
                        }}
                      >
                        {generatedNeshinePlace?.title}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontKarlaExtraLight,
                          fontSize: dimensions.width * 0.043,
                          marginTop: dimensions.height * 0.005,
                          alignSelf: 'flex-start',
                          color: 'white',
                          textAlign: "left",
                          alignItems: 'center',
                          maxWidth: dimensions.width * 0.8,
                          justifyContent: 'center',
                        }}
                      >
                        {generatedNeshinePlace?.description}
                      </Text>

                      <View style={{
                        marginTop: dimensions.height * 0.0241,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignSelf: 'center',
                        width: '100%',
                      }}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedNeshinePlace(generatedNeshinePlace);
                            setIsNeshineMapPlaceVisible(true);
                            setSelectedNeshineScreen('NeshineMap');
                          }}
                          style={{
                            alignSelf: 'center',
                            width: dimensions.width * 0.44,
                          }}
                        >
                          <LinearGradient
                            colors={['#FFF0B5', '#FDCC06']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={{
                              borderRadius: dimensions.width * 0.037,
                              width: dimensions.width * 0.4,
                              height: dimensions.height * 0.066,
                              alignSelf: 'flex-start',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: fontKarlaRegular,
                                color: 'black',
                                fontSize: dimensions.width * 0.043,
                                textAlign: 'center',
                                fontWeight: 600
                              }}>
                              Set Route
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            saveNeshinePlace(generatedNeshinePlace);
                          }}
                          style={{
                            height: dimensions.width * 0.140,
                            padding: dimensions.width * 0.037,
                            backgroundColor: '#2F2E31',
                            borderRadius: dimensions.width * 0.035,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: dimensions.width * 0.140,
                            borderColor: 'white',
                            backgroundColor: isNeshinePlaceSaved(generatedNeshinePlace) ? '#FDCC06' : 'transparent',
                            borderWidth: !isNeshinePlaceSaved(generatedNeshinePlace) ? dimensions.width * 0.003 : 0,
                          }}>
                          <Image
                            source={isNeshinePlaceSaved(generatedNeshinePlace)
                              ? require('../assets/icons/blackInappIcons/savedIcon.png')
                              : require('../assets/icons/inappIcons/savedIcon.png')
                            }
                            style={{
                              width: dimensions.width * 0.055,
                              height: dimensions.width * 0.055,
                              textAlign: 'center',
                              zIndex: 10
                            }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            shareNeshinePlace(generatedNeshinePlace?.title)
                          }}
                          style={{
                            justifyContent: 'center',
                            padding: dimensions.width * 0.037,
                            width: dimensions.width * 0.140,
                            borderRadius: dimensions.width * 0.035,
                            alignItems: 'center',
                            height: dimensions.width * 0.140,
                            shadowColor: '#111',
                            backgroundColor: '#2F2E31',
                            shadowOffset: {
                              width: 0,
                              height: dimensions.height * 0.004,
                            },
                            borderColor: '#fff',
                            shadowOpacity: 0.3,
                            elevation: 5,
                            backgroundColor: 'transparent',
                            borderWidth: dimensions.width * 0.003,
                            shadowRadius: dimensions.width * 0.0005,
                          }}>
                          <Image
                            source={require('../assets/icons/whiteShareNeshineIcon.png')}
                            style={{
                              width: dimensions.width * 0.055,
                              height: dimensions.width * 0.055,
                              textAlign: 'center',
                            }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedNeshinePlace(generatedNeshinePlace);
                      setGeneratedNeshinePlace(null);
                      setIsNeshineMapPlaceVisible(false);
                    }}
                    style={{
                      alignSelf: 'center',
                      width: dimensions.width * 0.9,
                      marginTop: dimensions.height * 0.025,
                    }}
                  >
                    <LinearGradient
                      colors={['#FFF0B5', '#FDCC06']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{
                        justifyContent: 'center',
                        borderRadius: dimensions.width * 0.5,
                        height: dimensions.height * 0.066,
                        alignSelf: 'center',
                        width: dimensions.width * 0.9,
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 600,
                          color: 'black',
                          fontSize: dimensions.width * 0.043,
                          textAlign: 'center',
                          fontFamily: fontKarlaRegular,
                        }}>
                        Search Again
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <>
              <View style={{
                borderBottomLeftRadius: dimensions.width * 0.1,
                paddingTop: dimensions.height * 0.001,
                borderTopLeftRadius: dimensions.width * 0.035,
                borderTopRightRadius: dimensions.width * 0.035,
                width: dimensions.width * 0.9,
                alignSelf: 'center',
                marginTop: dimensions.height * 0.05,
                borderBottomRightRadius: dimensions.width * 0.1,
              }}>
                <View style={{
                  width: dimensions.width * 0.9,
                  borderRadius: dimensions.width * 0.031,
                  alignSelf: 'center',
                  alignSelf: 'center',
                }}>
                  <Text
                    style={{
                      marginTop: dimensions.height * 0.007,
                      fontSize: dimensions.width * 0.059,
                      fontFamily: fontKarlaRegular,
                      fontWeight: 600,
                      color: 'white',
                      textAlign: 'center',
                    }}>
                    {selectedNeshineCategory?.title}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: dimensions.width * 0.07, }}>
                    <Text
                      style={{
                        marginTop: dimensions.height * 0.007,
                        fontSize: dimensions.width * 0.04,
                        fontFamily: fontKarlaRegular,
                        fontWeight: 400,
                        color: 'white',
                        opacity: 0.7,
                        textAlign: 'center',
                      }}>
                      Searching the spot for you
                    </Text>
                    <View style={{ minWidth: dimensions.width * 0.1, alignItems: 'flex-start' }}>
                      <Text
                        style={{
                          fontFamily: fontKarlaRegular,
                          fontSize: dimensions.width * 0.04,
                          fontWeight: 600,
                          color: 'white',
                          opacity: 0.7,
                          textAlign: 'left',
                        }}>
                        {neshineDots}
                      </Text>
                    </View>
                  </View>

                  <View style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: dimensions.height * 0.05,
                    width: dimensions.width * 0.9,
                  }}>
                    <Loader />
                  </View>

                  <TouchableOpacity
                    disabled={true}
                    onPress={() => {
                      handleGenerateShinePlace();
                    }}
                    style={{
                      alignSelf: 'center',
                      width: dimensions.width * 0.7,
                      opacity: 0.5,
                      marginTop: dimensions.height * 0.025,
                    }}
                  >
                    <LinearGradient
                      colors={['#FFF0B5', '#FDCC06']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{
                        width: dimensions.width * 0.9,
                        height: dimensions.height * 0.066,
                        zIndex: 0,
                        alignSelf: 'center',
                        borderRadius: dimensions.width * 0.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: dimensions.height * 0.023,
                      }}
                    >
                      <View style={{ alignItems: 'center', }}>
                        <Text
                          style={{
                            fontFamily: fontKarlaRegular,
                            color: 'black',
                            fontSize: dimensions.width * 0.046,
                            fontWeight: 600,
                          }}
                        >
                          Searching
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </SafeAreaView>
      ) : selectedNeshineScreen === 'NeshineFavorites' ? (
        <NeshineFavouritesScreen setSelectedNeshineScreen={setSelectedNeshineScreen} setSelectedNeshinePlace={setSelectedNeshinePlace} savedNeshinePlaces={savedNeshinePlaces} setSavedNeshinePlaces={setSavedNeshinePlaces} setIsNeshineMapPlaceVisible={setIsNeshineMapPlaceVisible} />
      ) : selectedNeshineScreen === 'NeshineMap' ? (
        <NeshineMapScreen setSelectedNeshineScreen={setSelectedNeshineScreen} selectedNeshinePlace={selectedNeshinePlace} isNeshineMapPlaceVisible={isNeshineMapPlaceVisible} setIsNeshineMapPlaceVisible={setIsNeshineMapPlaceVisible} setSavedNeshinePlaces={setSavedNeshinePlaces} savedNeshinePlaces={savedNeshinePlaces} selectedNeshineScreen={selectedNeshineScreen} />
      ) : selectedNeshineScreen === 'GalleryScreen' ? (
        <GalleryScreen setSelectedNeshineScreen={setSelectedNeshineScreen} galeryData={galeryData} setSavedNeshinePlaces={setSavedNeshinePlaces} savedNeshinePlaces={savedNeshinePlaces} />
      ) : selectedNeshineScreen === 'NeshineBlog' ? (
        <NeshineBlogScreen setSelectedNeshineScreen={setSelectedNeshineScreen} setSavedNeshinePlaces={setSavedNeshinePlaces} savedNeshinePlaces={savedNeshinePlaces} />
      ) : selectedNeshineScreen === 'WelcomePage' ? (
        <WelcomePageScreen setSelectedNeshineScreen={setSelectedNeshineScreen} setSavedNeshinePlaces={setSavedNeshinePlaces} savedNeshinePlaces={savedNeshinePlaces} />
      ) : selectedNeshineScreen === 'NeshineQuiz' ? (
        <NeshineQuizzScreen setSelectedNeshineScreen={setSelectedNeshineScreen} selectedNeshineScreen={selectedNeshineScreen} isNeshineQuizStarted={isNeshineQuizStarted} setIsNeshineQuizStarted={setIsNeshineQuizStarted} />
      ) : selectedNeshineScreen === 'LoadingNeshine' ? (
        <LoadingNeshineScreen setSelectedNeshineScreen={setSelectedNeshineScreen} />
      ) : null}

      {selectedNeshineScreen !== 'LoadingNeshine' && (
        <View
          style={{
            position: 'absolute',
            bottom: dimensions.height * 0.034,
            backgroundColor: '#0C0C0C',
            height: dimensions.height * 0.08,
            width: dimensions.width * 0.9,
            borderColor: '#FDCC06',
            borderWidth: dimensions.width * 0.003,
            paddingHorizontal: dimensions.width * 0.034,
            borderRadius: dimensions.width * 0.025,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            paddingVertical: dimensions.height * 0.007,
            zIndex: 5000,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.28,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
          {bottomBtns.map((button, index) => (
            <TouchableOpacity
              key={button.id}
              onPress={() => setSelectedNeshineScreen(button.screen)}
              style={{
                paddingHorizontal: dimensions.height * 0.014,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selectedNeshineScreen === button.screen ? '#FDCC06' : '#1E1E1E',
                width: dimensions.height * 0.066,
                height: dimensions.height * 0.066,
                borderRadius: dimensions.height * 0.01,
              }}
            >
              <Image
                source={selectedNeshineScreen === button.screen ? button.goldCulinaryIcon : button.whiteCulinaryIcon}
                style={{
                  width: dimensions.height * 0.025,
                  height: dimensions.height * 0.025,
                  textAlign: 'center'
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
