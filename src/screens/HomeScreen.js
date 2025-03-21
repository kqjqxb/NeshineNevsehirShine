import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Alert,
  ScrollView,
  Share,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import FavouritesScreen from './FavouritesScreen';
import CulinaryMapScreen from './CulinaryMapScreen';

import mysticWondersData from '../components/mysticWondersData';
import goldenHeritageData from '../components/goldenHeritageData';
import sunsetSerenityData from '../components/sunsetSerenityData';
import localDelightsData from '../components/localDelightsData';
import Loader from '../components/Loader';
import GalleryScreen from './GalleryScreen';
import BlogScreen from './BlogScreen';
import WelcomePageScreen from './WelcomePageScreen';

const fontKarlaRegular = 'Karla-Regular';
const fontKarlaLight = 'Karla-Light';
const fontKarlaExtraLight = 'Karla-ExtraLight';

const bottomBtns = [
  {
    id: 4,
    screen: 'Favourites',
    whiteCulinaryIcon: require('../assets/icons/inappIcons/savedIcon.png'),
    goldCulinaryIcon: require('../assets/icons/blackInappIcons/savedIcon.png'),
  },
  {
    id: 3,
    screen: 'CulinaryMap',
    whiteCulinaryIcon: require('../assets/icons/inappIcons/mapIcon.png'),
    goldCulinaryIcon: require('../assets/icons/blackInappIcons/mapIcon.png'),
  },
  {
    id: 1,
    screen: 'Home',
    whiteCulinaryIcon: require('../assets/icons/inappIcons/starIcon.png'),
    goldCulinaryIcon: require('../assets/icons/blackInappIcons/starIcon.png'),
  },

  {
    id: 2,
    screen: 'Blog',
    whiteCulinaryIcon: require('../assets/icons/inappIcons/blogIcon.png'),
    goldCulinaryIcon: require('../assets/icons/blackInappIcons/blogIcon.png'),
  },
  {
    id: 5,
    screen: 'Top5Restaurants',
    whiteCulinaryIcon: require('../assets/icons/inappIcons/galeryIcon.png'),
    goldCulinaryIcon: require('../assets/icons/blackInappIcons/galeryIcon.png'),
  },
]

const categoryButtons = [
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
  const [selectedCulinaryScreen, setSelectedCulinaryScreen] = useState('Home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [savedCulinaryRestaurats, setSavedCulinaryRestaurats] = useState([]);
  const [isCulinaryMapRestaurantVisible, setIsCulinaryMapRestaurantVisible] = useState(false);
  const [generatedCulinaryRestaurant, setGeneratedCulinaryRestaurant] = useState(null);
  const [selectedCulinaryRestaurat, setSelectedCulinaryRestaurat] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [culinaryDots, setCulinaryDots] = useState('');
  const [isNeshineWelcomeWasVisible, setIsNeshineWelcomeWasVisible] = useState(false);
  const [loadingNeshineWelcomeApp, setLoadingNeshineWelcomeApp] = useState(true);

  useEffect(() => {
    const loadNeshineWelcome = async () => {
      try {

        const isNeshineWelcomeWasVisible = await AsyncStorage.getItem('isNeshineWelcomeWasVisible');

        if (isNeshineWelcomeWasVisible) {
          setIsNeshineWelcomeWasVisible(false);
        } else {
          setSelectedCulinaryScreen('WelcomePage');
          setIsNeshineWelcomeWasVisible(true);
          await AsyncStorage.setItem('isNeshineWelcomeWasVisible', 'true');
        }
      } catch (error) {
        console.error('Error loading of neshine welcome', error);
      } finally {
        setLoadingNeshineWelcomeApp(false);
      }
    };
    loadNeshineWelcome();
  }, []);

  const loadCulinaryRestaurats = async () => {
    try {
      const storedCulinaryRestaurats = await AsyncStorage.getItem('savedCulinaryRestaurats');
      const parsedCulinaryRestaurats = storedCulinaryRestaurats ? JSON.parse(storedCulinaryRestaurats) : [];
      setSavedCulinaryRestaurats(parsedCulinaryRestaurats);
    } catch (error) {
      console.error('Error loading savedCulinaryRestaurats:', error);
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

  const shinesData = getShineDataByCategory(selectedCategory?.title);

  const isCulinaryRestaurantSaved = (thisRest) => {
    return savedCulinaryRestaurats.some((kn) => kn.id === thisRest?.id);
  };

  const saveCulinaryRestaurant = async (rest) => {
    try {
      const savedRest = await AsyncStorage.getItem('savedCulinaryRestaurats');
      const parsedRests = savedRest ? JSON.parse(savedRest) : [];

      const thisRestIndex = parsedRests.findIndex((r) => r.id === rest.id);

      if (thisRestIndex === -1) {
        const updatedRests = [rest, ...parsedRests];
        await AsyncStorage.setItem('savedCulinaryRestaurats', JSON.stringify(updatedRests));
        setSavedCulinaryRestaurats(updatedRests);
        console.log('rest was saved');
      } else {
        const updatedRests = parsedRests.filter((r) => r.id !== rest.id);
        await AsyncStorage.setItem('savedCulinaryRestaurats', JSON.stringify(updatedRests));
        setSavedCulinaryRestaurats(updatedRests);
        console.log('rest was deleted');
      }
    } catch (error) {
      console.error('error of save/delete rest:', error);
    }
  };

  const handleGenerateRestaurant = () => {
    setIsGenerating(true);
    const randomIndex = Math.floor(Math.random() * shinesData.length);
    const randomRest = shinesData[randomIndex];
    setGeneratedCulinaryRestaurant(randomRest);
    setSelectedCulinaryRestaurat(randomRest);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1000);
  }

  const shareCulinaryApp = async () => {
    try {
      await Share.share({
        message: `Join Culinary Crovvn - Melbourn!${appLink}`,
      });
    } catch (error) {
      console.error('Error share:', error);
    }
  };

  const shareCulinaryRestaurant = async (title) => {
    try {
      await Share.share({
        message: `Let's go to the restaurant ${title}! I found it on the Culinary Crovvn - Melbourn!`,
      });
    } catch (error) {
      console.error('Error share:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCulinaryDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log('generatedCulinaryRestaurant:', generatedCulinaryRestaurant);
  }, [generatedCulinaryRestaurant])

  return (
    <View style={{
      backgroundColor: '#171717',
      flex: 1,
      height: dimensions.height,
      width: dimensions.width,
    }}>
      <View style={{
        width: dimensions.width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#0C0C0C',
        borderBottomLeftRadius: dimensions.width * 0.05,
        borderBottomRightRadius: dimensions.width * 0.05,
        height: dimensions.height * 0.143,
        shadowColor: '#FDCC06',
        shadowOffset: { width: 0, height: dimensions.height * 0.0019 },
        shadowOpacity: 1,
        shadowRadius: dimensions.height * 0.0001,
        paddingHorizontal: dimensions.width * 0.05,
        paddingTop: dimensions.height * 0.04,
      }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedCulinaryScreen('WelcomePage');
          }}
          style={{
            width: dimensions.width * 0.143,
            height: dimensions.width * 0.143,
            borderRadius: dimensions.width * 0.04,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: selectedCulinaryScreen === 'WelcomePage' ? '#FDCC06' : 'transparent',
            borderColor: 'white',
            borderWidth: selectedCulinaryScreen === 'NeshineQuiz' ? 0 : dimensions.width * 0.003,
          }}>
          <Image
            source={selectedCulinaryScreen === 'WelcomePage'
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
          Welcome Page
        </Text>

        <TouchableOpacity
          onPress={() => {
            setSelectedCulinaryScreen('NeshineQuiz')
          }}
          style={{
            width: dimensions.width * 0.143,
            height: dimensions.width * 0.143,
            borderRadius: dimensions.width * 0.04,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: selectedCulinaryScreen === 'NeshineQuiz' ? '#FDCC06' : 'transparent',
            borderColor: 'white',
            borderWidth: selectedCulinaryScreen !== 'NeshineQuiz' ? dimensions.width * 0.003 : 0,
          }}>
          <Image
            source={selectedCulinaryScreen === 'NeshineQuiz'
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
        </TouchableOpacity>
      </View>
      {selectedCulinaryScreen === 'Home' ? (
        <SafeAreaView style={{
          flex: 1,
          paddingHorizontal: dimensions.width * 0.05,
          width: dimensions.width,
        }}>
          {!isGenerating ? (
            <>
              {!generatedCulinaryRestaurant ? (
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
                    {categoryButtons.map((category, index) => (
                      <TouchableOpacity
                        onPress={() => { setSelectedCategory(category) }}
                        key={index} style={{
                          borderRadius: dimensions.width * 0.05,
                          borderColor: selectedCategory === category ? '#F15257' : 'transparent',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: dimensions.width * 0.44,
                          marginBottom: dimensions.width * 0.04,
                          shadowColor: '#FDCC06',
                          shadowOffset: { width: 0, height: dimensions.height * 0.0021 },
                          shadowOpacity: selectedCategory === category ? 0.55 : 0,
                          shadowRadius: dimensions.width * 0.03,
                          elevation: 5,
                        }}>
                        <Image
                          source={category.image}
                          style={{
                            width: dimensions.width * 0.43,
                            height: dimensions.width * 0.43,
                            textAlign: 'center',
                            borderColor: selectedCategory === category ? '#FDCC06' : 'white',
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
                      handleGenerateRestaurant();
                    }}
                    style={{
                      height: dimensions.height * 0.07,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      borderRadius: dimensions.width * 0.5,
                      opacity: selectedCategory === '' || !selectedCategory ? 0.5 : 1,
                      shadowColor: '#FDCC06',
                      shadowOffset: { width: 0, height: dimensions.height * 0.0021 },
                      shadowOpacity: 0.4,
                      shadowRadius: dimensions.width * 0.03,
                      elevation: 5,
                    }}
                    disabled={selectedCategory === '' || !selectedCategory}
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
                      source={generatedCulinaryRestaurant?.image}
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
                        {generatedCulinaryRestaurant?.title}
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
                        {generatedCulinaryRestaurant?.description}
                      </Text>

                      <View style={{
                        marginTop: dimensions.height * 0.0241,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignSelf: 'center',
                        width: '100%',
                        marginBottom: dimensions.height * 0.027,
                      }}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedCulinaryRestaurat(generatedCulinaryRestaurant);
                            setIsCulinaryMapRestaurantVisible(true);
                            setSelectedCulinaryScreen('CulinaryMap');
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
                            saveCulinaryRestaurant(generatedCulinaryRestaurant);
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
                            backgroundColor: isCulinaryRestaurantSaved(generatedCulinaryRestaurant) ? '#FDCC06' : 'transparent',
                            borderWidth: !isCulinaryRestaurantSaved(generatedCulinaryRestaurant) ? dimensions.width * 0.003 : 0,
                          }}>
                          <Image
                            source={isCulinaryRestaurantSaved(generatedCulinaryRestaurant)
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
                            shareCulinaryRestaurant(generatedCulinaryRestaurant?.title)
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
                      setSelectedCulinaryRestaurat(generatedCulinaryRestaurant);
                      setGeneratedCulinaryRestaurant(null);
                      setIsCulinaryMapRestaurantVisible(false);
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
                    {selectedCategory?.title}
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
                        {culinaryDots}
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
                      handleGenerateRestaurant();
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
      ) : selectedCulinaryScreen === 'Favourites' ? (
        <FavouritesScreen setSelectedCulinaryScreen={setSelectedCulinaryScreen} setSelectedCulinaryRestaurat={setSelectedCulinaryRestaurat} savedCulinaryRestaurats={savedCulinaryRestaurats} setSavedCulinaryRestaurats={setSavedCulinaryRestaurats} setIsCulinaryMapRestaurantVisible={setIsCulinaryMapRestaurantVisible} />
      ) : selectedCulinaryScreen === 'CulinaryMap' ? (
        <CulinaryMapScreen setSelectedCulinaryScreen={setSelectedCulinaryScreen} selectedCulinaryRestaurat={selectedCulinaryRestaurat} isCulinaryMapRestaurantVisible={isCulinaryMapRestaurantVisible} setIsCulinaryMapRestaurantVisible={setIsCulinaryMapRestaurantVisible} setSavedCulinaryRestaurats={setSavedCulinaryRestaurats} savedCulinaryRestaurats={savedCulinaryRestaurats} selectedCulinaryScreen={selectedCulinaryScreen} />
      ) : selectedCulinaryScreen === 'Top5Restaurants' ? (
        <GalleryScreen setSelectedCulinaryScreen={setSelectedCulinaryScreen} setSavedCulinaryRestaurats={setSavedCulinaryRestaurats} savedCulinaryRestaurats={savedCulinaryRestaurats} />
      ) : selectedCulinaryScreen === 'Blog' ? (
        <BlogScreen setSelectedCulinaryScreen={setSelectedCulinaryScreen} setSavedCulinaryRestaurats={setSavedCulinaryRestaurats} savedCulinaryRestaurats={savedCulinaryRestaurats} />
      ) : selectedCulinaryScreen === 'WelcomePage' ? (
        <WelcomePageScreen setSelectedCulinaryScreen={setSelectedCulinaryScreen} setSavedCulinaryRestaurats={setSavedCulinaryRestaurats} savedCulinaryRestaurats={savedCulinaryRestaurats} />
      ) : null}

      <View
        style={{
          position: 'absolute',
          bottom: dimensions.height * 0.055,
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
            onPress={() => setSelectedCulinaryScreen(button.screen)}
            style={{
              paddingHorizontal: dimensions.height * 0.014,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selectedCulinaryScreen === button.screen ? '#FDCC06' : '#1E1E1E',
              width: dimensions.height * 0.066,
              height: dimensions.height * 0.066,
              borderRadius: dimensions.height * 0.01,
            }}
          >
            <Image
              source={selectedCulinaryScreen === button.screen ? button.goldCulinaryIcon : button.whiteCulinaryIcon}
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
    </View>
  );
};

export default HomeScreen;
