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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import FavouritesScreen from './FavouritesScreen';
import CulinaryMapScreen from './CulinaryMapScreen';

import modernFusionData from '../components/modernFusionData';
import herritageFlavorsData from '../components/herritageFlavorsData';
import coastalBitesData from '../components/coastalBitesData';
import hiddenGemsData from '../components/hiddenGemsData';
import Loader from '../components/Loader';
import Top5RatingScreen from './Top5RatingScreen';
import BlogScreen from './BlogScreen';

const fontK2DRegular = 'K2D-Regular';

const bottomBtns = [
  {
    id: 1,
    screen: 'Home',
    whiteCulinaryIcon: require('../assets/icons/whiteCulinaryButtons/homeCulinaryIcon.png'),
    goldCulinaryIcon: require('../assets/icons/goldCulinaryButtons/homeCulinaryIcon.png'),
  },
  {
    id: 2,
    screen: 'Blog',
    whiteCulinaryIcon: require('../assets/icons/whiteCulinaryButtons/bookCulinaryIcon.png'),
    goldCulinaryIcon: require('../assets/icons/goldCulinaryButtons/bookCulinaryIcon.png'),
  },
  {
    id: 3,
    screen: 'CulinaryMap',
    whiteCulinaryIcon: require('../assets/icons/whiteCulinaryButtons/mapCulinaryIcon.png'),
    goldCulinaryIcon: require('../assets/icons/goldCulinaryButtons/mapCulinaryIcon.png'),
  },
  {
    id: 4,
    screen: 'Favourites',
    whiteCulinaryIcon: require('../assets/icons/whiteCulinaryButtons/favouritesCulinaryIcon.png'),
    goldCulinaryIcon: require('../assets/icons/goldCulinaryButtons/favouritesCulinaryIcon.png'),
  },
  {
    id: 5,
    screen: 'Top5Restaurants',
    whiteCulinaryIcon: require('../assets/icons/whiteCulinaryButtons/starCulinaryIcon.png'),
    goldCulinaryIcon: require('../assets/icons/goldCulinaryButtons/starCulinaryIcon.png'),
  },
]

const categoriesData = [
  { id: 1, label: 'Modern Fusion' },
  { id: 2, label: 'Heritage Flavors' },
  { id: 3, label: 'Coastal Bites' },
  { id: 4, label: 'Hidden Gems' },
];

const appLink = '';

const HomeScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedCulinaryScreen, setSelectedCulinaryScreen] = useState('Home');
  const [selectedCategory, setSelectedCategory] = useState(categoriesData[1]);
  const [savedCulinaryRestaurats, setSavedCulinaryRestaurats] = useState([]);
  const [isCulinaryMapRestaurantVisible, setIsCulinaryMapRestaurantVisible] = useState(false);
  const [generatedCulinaryRestaurant, setGeneratedCulinaryRestaurant] = useState(null);
  const [selectedCulinaryRestaurat, setSelectedCulinaryRestaurat] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [culinaryDots, setCulinaryDots] = useState('');

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

  const getRestsDataByCategory = (activityCtgr) => {
    switch (activityCtgr) {
      case 'Modern Fusion':
        return modernFusionData;
      case 'Heritage Flavors':
        return herritageFlavorsData;
      case 'Coastal Bites':
        return coastalBitesData;
      case 'Hidden Gems':
        return hiddenGemsData;
      default:
        return [];
    }
  };

  const restaurantsData = getRestsDataByCategory(selectedCategory.label);

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
    const randomIndex = Math.floor(Math.random() * restaurantsData.length);
    const randomRest = restaurantsData[randomIndex];
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
    setSelectedCategory(categoriesData[1]);
  }, [selectedCulinaryScreen, generatedCulinaryRestaurant]);

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
      backgroundColor: '#2F2E31',
      flex: 1,
      height: dimensions.height,
      width: dimensions.width,
    }}>
      <View
        style={{
          top: dimensions.height * 0.07,
          backgroundColor: '#39383D',
          height: dimensions.height * 0.08,
          width: dimensions.width * 0.9,
          paddingHorizontal: dimensions.width * 0.03,
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
            }}
          >
            <Image
              source={selectedCulinaryScreen === button.screen ? button.goldCulinaryIcon : button.whiteCulinaryIcon}
              style={{
                width: dimensions.height * 0.034,
                height: dimensions.height * 0.034,
                textAlign: 'center'
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
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
                <ScrollView style={{
                  width: dimensions.width,
                  alignSelf: 'center',
                }} contentContainerStyle={{
                  paddingBottom: dimensions.height * 0.16,
                }} showsVerticalScrollIndicator={false}>
                  <View style={{
                    width: dimensions.width * 0.9,
                    paddingTop: dimensions.height * 0.001,
                    borderTopLeftRadius: dimensions.width * 0.035,
                    borderTopRightRadius: dimensions.width * 0.035,
                    borderBottomLeftRadius: dimensions.width * 0.1,
                    borderBottomRightRadius: dimensions.width * 0.1,
                    backgroundColor: '#CCA65A',
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.1,
                  }}>
                    <View style={{
                      width: dimensions.width * 0.9,
                      paddingTop: dimensions.height * 0.01,
                      borderRadius: dimensions.width * 0.031,
                      backgroundColor: '#39383D',
                      alignSelf: 'center',
                    }}>
                      <Text
                        style={{
                          marginTop: dimensions.height * 0.007,
                          fontSize: dimensions.width * 0.059,
                          fontFamily: fontK2DRegular,
                          fontWeight: 600,
                          color: 'white',
                          textAlign: 'center',
                          alignSelf: 'center',
                        }}>
                        Restaurans Explorer
                      </Text>

                      <Text
                        style={{
                          fontFamily: fontK2DRegular,
                          fontSize: dimensions.width * 0.043,
                          paddingHorizontal: dimensions.width * 0.1,
                          color: '#C6C6C6',
                          textAlign: 'center',
                          marginTop: dimensions.height * 0.007,
                        }}>
                        Tap to choose the category
                      </Text>
                      <LinearGradient
                        colors={['rgba(115, 115, 115, 0.3)', 'rgba(217, 217, 217, 0.3)', 'rgba(115, 115, 115, 0.3)']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{
                          alignSelf: 'center',
                          borderRadius: dimensions.width * 0.032,
                          width: dimensions.width * 0.8,
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: dimensions.height * 0.28,
                          marginVertical: dimensions.height * 0.021,
                        }}
                      >
                        {categoriesData.map((category, index) => (
                          <TouchableOpacity
                            key={category.id}
                            onPress={() => {
                              setSelectedCategory(category);
                            }}
                            style={{
                              width: dimensions.width * 0.8,
                              alignSelf: 'center',
                              borderBottomWidth: selectedCategory === category && index !== categoriesData.length - 1 ? dimensions.width * 0.003 : 0,
                              borderTopWidth: selectedCategory === category && index !== 0 ? dimensions.width * 0.003 : 0,
                              borderColor: '#FDFADD',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: dimensions.height * 0.07,
                              backgroundColor: selectedCategory === category ? 'rgba(47, 46, 49, 0.5)' : 'transparent',
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: fontK2DRegular,
                                fontSize: selectedCategory === category ? dimensions.width * 0.046 : dimensions.width * 0.043,
                                paddingHorizontal: dimensions.width * 0.1,
                                alignSelf: 'center',
                                color: selectedCategory === category ? 'white' : '#C6C6C6',
                                textAlign: 'center',
                                fontWeight: selectedCategory === category ? 600 : 400,
                              }}>
                              {category.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </LinearGradient>

                      <TouchableOpacity
                        onPress={() => {
                          handleGenerateRestaurant();
                        }}
                        style={{
                          alignSelf: 'center',
                          width: dimensions.width * 0.7,
                        }}
                      >
                        <LinearGradient
                          colors={['#CCA65A', '#FDFADD']}
                          start={{ x: 0, y: 0.5 }}
                          end={{ x: 1, y: 0.5 }}
                          style={{
                            width: dimensions.width * 0.8,
                            height: dimensions.height * 0.066,
                            zIndex: 0,
                            alignSelf: 'center',
                            borderRadius: dimensions.width * 0.037,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: dimensions.height * 0.023,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fontK2DRegular,
                              color: 'black',
                              fontSize: dimensions.width * 0.046,
                              textAlign: 'center',
                              fontWeight: 600
                            }}>
                            Search
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>


                  {!isGenerating && !generatedCulinaryRestaurant && (
                    <>
                      <Image
                        source={require('../assets/images/homeCulinaryImage.png')}
                        style={{
                          width: dimensions.width * 0.9,
                          height: dimensions.height * 0.21,
                          alignSelf: 'center',
                          marginTop: dimensions.height * 0.04,
                          borderRadius: dimensions.width * 0.05,
                        }}
                        resizeMode="cover"
                      />
                      <Text
                        style={{
                          fontFamily: fontK2DRegular,
                          color: '#e9d8a7',
                          fontSize: dimensions.width * 0.1,
                          textAlign: 'left',
                          paddingHorizontal: dimensions.width * 0.05,
                          fontWeight: 600
                        }}>
                        A
                        <Text
                          style={{
                            fontFamily: fontK2DRegular,
                            color: 'white',
                            fontSize: dimensions.width * 0.055,
                            textAlign: 'left',
                            paddingHorizontal: dimensions.width * 0.05,
                            fontWeight: 600
                          }}>
                          bout Melbourne Culinarity
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontK2DRegular,
                          color: '#C6C6C6',
                          fontSize: dimensions.width * 0.04,
                          textAlign: 'left',
                          paddingHorizontal: dimensions.width * 0.05,
                          fontWeight: 400,
                          marginTop: dimensions.height * 0.008,
                        }}>
                        Melbourne is a food lover’s paradise, offering a rich blend of cultures and flavors. From authentic Australian cuisine to world-class fusion dishes, the city’s diverse dining scene is shaped by its multicultural heritage. With vibrant food markets, top-tier restaurants, and hidden gems, Melbourne is the perfect destination for culinary exploration. Whether you crave fresh seafood, artisan coffee, or innovative gastronomy, the city has something to delight every palate.
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          shareCulinaryApp();
                        }}
                        style={{
                          alignSelf: 'center',
                          width: dimensions.width * 0.9,
                          marginTop: dimensions.height * 0.05,
                        }}
                      >
                        <LinearGradient
                          colors={['#CCA65A', '#FDFADD']}
                          start={{ x: 0, y: 0.5 }}
                          end={{ x: 1, y: 0.5 }}
                          style={{
                            width: dimensions.width * 0.9,
                            height: dimensions.height * 0.066,
                            alignSelf: 'center',
                            borderRadius: dimensions.width * 0.037,
                            marginBottom: dimensions.height * 0.023,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Image
                            source={require('../assets/icons/shareCulinaryIcon.png')}
                            style={{
                              width: dimensions.height * 0.021,
                              height: dimensions.height * 0.021,
                              marginRight: dimensions.width * 0.03
                            }}
                            resizeMode='contain'
                          />
                          <Text
                            style={{
                              fontFamily: fontK2DRegular,
                              color: 'black',
                              fontSize: dimensions.width * 0.046,
                              textAlign: 'center',
                              fontWeight: 600
                            }}>
                            Share App
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </>
                  )}
                </ScrollView>
              ) : (
                <View style={{
                  width: '100%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 100,
                  position: 'absolute',
                  marginTop: dimensions.height * 0.1,
                }}>
                  <View style={{
                    width: dimensions.width * 0.9,
                    paddingTop: dimensions.height * 0.01,
                    borderRadius: dimensions.width * 0.031,
                    backgroundColor: '#39383D',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#CCA65A',
                    shadowOffset: {
                      width: 0,
                      height: -dimensions.height * 0.0021,
                    },
                    shadowOpacity: 1,
                    shadowRadius: dimensions.width * 0.001,
                    elevation: 5,
                  }}>
                    <Text
                      style={{
                        fontFamily: fontK2DRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.064,
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontWeight: 600,
                        paddingVertical: dimensions.height * 0.014,
                      }}>
                      Search Result:
                    </Text>
                  </View>
                  <View style={{
                    width: dimensions.width * 0.9,
                    alignSelf: 'center',
                    borderRadius: dimensions.width * 0.04,
                    backgroundColor: '#39383D',
                    marginTop: dimensions.height * 0.021,
                    shadowColor: '#111',
                    shadowOffset: {
                      width: 0,
                      height: dimensions.height * 0.007,
                    },
                    shadowOpacity: 0.88,
                    shadowRadius: dimensions.width * 0.03,
                    elevation: 5,
                  }}>
                    <Image
                      source={generatedCulinaryRestaurant?.image}
                      style={{
                        width: '100%',
                        height: dimensions.height * 0.25,
                        borderTopLeftRadius: dimensions.width * 0.04,
                        borderTopRightRadius: dimensions.width * 0.04,
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
                          fontFamily: fontK2DRegular,
                          textAlign: "left",
                          fontSize: dimensions.width * 0.05,
                          alignSelf: 'flex-start',
                          fontWeight: 600,
                          color: '#CCA65A',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {generatedCulinaryRestaurant?.title}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontK2DRegular,
                          textAlign: "left",
                          fontSize: dimensions.width * 0.039,
                          alignSelf: 'flex-start',
                          fontWeight: 400,
                          color: '#C6C6C6',
                          alignItems: 'center',
                          justifyContent: 'center',
                          maxWidth: dimensions.width * 0.8,
                          marginTop: dimensions.height * 0.005

                        }}
                      >
                        {generatedCulinaryRestaurant?.description}
                      </Text>

                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'flex-start',
                        marginTop: dimensions.height * 0.007
                      }}>
                        <Text
                          style={{
                            fontFamily: fontK2DRegular,
                            textAlign: "left",
                            fontSize: dimensions.width * 0.039,
                            fontWeight: 400,
                            color: '#CCA65A',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: dimensions.width * 0.03,
                          }}
                        >
                          Rating:
                        </Text>

                        {[1, 2, 3, 4, 5].map((star, index) => (
                          star <= generatedCulinaryRestaurant.rating ? (
                            <Text
                              key={star}
                              style={{
                                fontFamily: fontK2DRegular,
                                textAlign: "left",
                                fontSize: dimensions.width * 0.03,
                                fontWeight: 400,
                                color: '#CCA65A',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: dimensions.width * 0.01,
                              }}
                            >
                              ★
                            </Text>
                          ) : (
                            <Text
                              key={star}
                              style={{
                                fontFamily: fontK2DRegular,
                                textAlign: "left",
                                fontSize: dimensions.width * 0.03,
                                fontWeight: 400,
                                color: '#CCA65A',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: dimensions.width * 0.01,

                              }}
                            >
                              ☆
                            </Text>
                          )
                        ))}
                      </View>


                      <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.025,
                        marginBottom: dimensions.height * 0.028,
                      }}>
                        <TouchableOpacity
                          onPress={() => {
                            saveCulinaryRestaurant(generatedCulinaryRestaurant);
                          }}
                          style={{
                            padding: dimensions.width * 0.04,
                            width: dimensions.width * 0.14,
                            height: dimensions.width * 0.14,
                            backgroundColor: '#2F2E31',
                            borderRadius: dimensions.width * 0.035,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <LinearGradient
                            colors={isCulinaryRestaurantSaved(generatedCulinaryRestaurant) ? ['#CCA65A', '#FFFCDD'] : ['transparent', 'transparent']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={{
                              width: dimensions.width * 0.14,
                              height: dimensions.width * 0.14,
                              zIndex: 0,
                              alignSelf: 'center',
                              borderRadius: dimensions.width * 0.035,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Image
                              source={isCulinaryRestaurantSaved(generatedCulinaryRestaurant)
                                ? require('../assets/icons/blackHeartIcon.png')
                                : require('../assets/icons/whiteHeartIcon.png')
                              }
                              style={{
                                width: dimensions.width * 0.055,
                                height: dimensions.width * 0.055,
                                textAlign: 'center',
                                zIndex: 10
                              }}
                              resizeMode="contain"
                            />
                          </LinearGradient>
                        </TouchableOpacity>

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
                            colors={['#CCA65A', '#FDFADD']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={{
                              width: dimensions.width * 0.44,
                              height: dimensions.height * 0.066,
                              alignSelf: 'center',
                              borderRadius: dimensions.width * 0.037,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: fontK2DRegular,
                                color: 'black',
                                fontSize: dimensions.width * 0.043,
                                textAlign: 'center',
                                fontWeight: 600
                              }}>
                              Open map
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>


                        <TouchableOpacity
                          onPress={() => {
                            shareCulinaryRestaurant(generatedCulinaryRestaurant?.title)
                          }}
                          style={{
                            padding: dimensions.width * 0.04,
                            width: dimensions.width * 0.14,
                            height: dimensions.width * 0.14,
                            backgroundColor: '#2F2E31',
                            borderRadius: dimensions.width * 0.035,
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#111',
                            shadowOffset: {
                              width: 0,
                              height: dimensions.height * 0.004,
                            },
                            shadowOpacity: 0.3,
                            shadowRadius: dimensions.width * 0.0005,
                            elevation: 5,
                          }}>
                          <Image
                            source={require('../assets/icons/whiteShareCulinaryIcon.png')}
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
                      colors={['#CCA65A', '#FDFADD']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{
                        width: dimensions.width * 0.9,
                        height: dimensions.height * 0.066,
                        alignSelf: 'center',
                        borderRadius: dimensions.width * 0.037,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fontK2DRegular,
                          color: 'black',
                          fontSize: dimensions.width * 0.043,
                          textAlign: 'center',
                          fontWeight: 600
                        }}>
                        Close
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <>
              <View style={{
                width: dimensions.width * 0.9,
                paddingTop: dimensions.height * 0.001,
                borderTopLeftRadius: dimensions.width * 0.035,
                borderTopRightRadius: dimensions.width * 0.035,
                borderBottomLeftRadius: dimensions.width * 0.1,
                borderBottomRightRadius: dimensions.width * 0.1,
                backgroundColor: '#CCA65A',
                alignSelf: 'center',
                marginTop: dimensions.height * 0.1,
              }}>
                <View style={{
                  width: dimensions.width * 0.9,
                  paddingTop: dimensions.height * 0.01,
                  borderRadius: dimensions.width * 0.031,
                  backgroundColor: '#39383D',
                  alignSelf: 'center',
                  alignSelf: 'center',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: dimensions.width * 0.07, }}>
                    <Text
                      style={{
                        marginTop: dimensions.height * 0.007,
                        fontSize: dimensions.width * 0.059,
                        fontFamily: fontK2DRegular,
                        fontWeight: 600,
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      Searching
                    </Text>
                    <View style={{ minWidth: dimensions.width * 0.1, alignItems: 'flex-start' }}>
                      <Text
                        style={{
                          fontFamily: fontK2DRegular,
                          fontSize: dimensions.width * 0.059,
                          fontWeight: 600,
                          color: 'white',
                          textAlign: 'left',
                        }}>
                        {culinaryDots}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      fontFamily: fontK2DRegular,
                      fontSize: dimensions.width * 0.043,
                      paddingHorizontal: dimensions.width * 0.1,
                      color: '#C6C6C6',
                      textAlign: 'center',
                      marginTop: dimensions.height * 0.007,
                    }}>
                    Please wait, we are searching the restaurant for you!
                  </Text>

                  <View style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: dimensions.height * 0.05,
                    width: dimensions.width * 0.9,
                  }}>
                    <Loader />
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: dimensions.width * 0.07, }}>
                    <Text
                      style={{
                        fontFamily: fontK2DRegular,
                        fontSize: dimensions.width * 0.043,
                        color: '#C6C6C6',
                        textAlign: 'center',
                        marginTop: dimensions.height * 0.007,
                      }}>
                      Loading
                    </Text>
                    <View style={{ minWidth: dimensions.width * 0.1, alignItems: 'flex-start', marginTop: dimensions.height * 0.007 }}>
                      <Text
                        style={{
                          fontFamily: fontK2DRegular,
                          fontSize: dimensions.width * 0.043,
                          color: '#C6C6C6',
                          textAlign: 'left',
                        }}>
                        {culinaryDots}
                      </Text>
                    </View>
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
                      colors={['#CCA65A', '#FDFADD']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{
                        width: dimensions.width * 0.8,
                        height: dimensions.height * 0.066,
                        zIndex: 0,
                        alignSelf: 'center',
                        borderRadius: dimensions.width * 0.037,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: dimensions.height * 0.023,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: dimensions.width * 0.07, }}>
                        <Text
                          style={{
                            fontFamily: fontK2DRegular,
                            color: 'black',
                            fontSize: dimensions.width * 0.046,
                            fontWeight: 600,
                          }}
                        >
                          Searching
                        </Text>
                        <View style={{ minWidth: dimensions.width * 0.1, marginLeft: dimensions.width * 0.001 }}>
                          <Text
                            style={{
                              fontFamily: fontK2DRegular,
                              color: 'black',
                              fontSize: dimensions.width * 0.046,
                              fontWeight: 600,
                              textAlign: 'left',
                            }}
                          >
                            {culinaryDots}
                          </Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </SafeAreaView>
      ) : selectedCulinaryScreen === 'Favourites' ? (
        <FavouritesScreen setSelectedCulinaryScreen={setSelectedCulinaryScreen} setSelectedCulinaryRestaurat={setSelectedCulinaryRestaurat} savedCulinaryRestaurats={savedCulinaryRestaurats} setSavedCulinaryRestaurats={setSavedCulinaryRestaurats} setIsCulinaryMapRestaurantVisible={setIsCulinaryMapRestaurantVisible}/>
      ) : selectedCulinaryScreen === 'CulinaryMap' ? (
        <CulinaryMapScreen setSelectedCulinaryScreen={setSelectedCulinaryScreen} selectedCulinaryRestaurat={selectedCulinaryRestaurat} isCulinaryMapRestaurantVisible={isCulinaryMapRestaurantVisible} setIsCulinaryMapRestaurantVisible={setIsCulinaryMapRestaurantVisible} setSavedCulinaryRestaurats={setSavedCulinaryRestaurats} savedCulinaryRestaurats={savedCulinaryRestaurats} selectedCulinaryScreen={selectedCulinaryScreen} />
      ) : selectedCulinaryScreen === 'Top5Restaurants' ? (
        <Top5RatingScreen setSelectedCulinaryScreen={setSelectedCulinaryScreen} setSavedCulinaryRestaurats={setSavedCulinaryRestaurats} savedCulinaryRestaurats={savedCulinaryRestaurats} />
      ) : selectedCulinaryScreen === 'Blog' ? (
        <BlogScreen setSelectedCulinaryScreen={setSelectedCulinaryScreen} setSavedCulinaryRestaurats={setSavedCulinaryRestaurats} savedCulinaryRestaurats={savedCulinaryRestaurats} />
      ) : null}
    </View>
  );
};

export default HomeScreen;
