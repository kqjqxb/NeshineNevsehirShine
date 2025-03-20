import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const fontK2DRegular = 'K2D-Regular';

const FavouritesScreen = ({ setSelectedCulinaryScreen, savedCulinaryRestaurats, setSavedCulinaryRestaurats, setIsCulinaryMapRestaurantVisible, setSelectedCulinaryRestaurat }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isKnotVisible, setIsKnotVisible] = useState(false);
  const [selectedKnot, setSelectedKnot] = useState(null);


  const isCulinaryRestSaved = (thisRest) => {
    return savedCulinaryRestaurats.some((r) => r.id === thisRest.id);
  };

  const handleDeleteCulinaryRestaurant = async (id) => {
    try {
      const updatedSavedRests = savedCulinaryRestaurats.filter(r => r.id !== id);
      setSavedCulinaryRestaurats(updatedSavedRests);
      await AsyncStorage.setItem('savedCulinaryRestaurats', JSON.stringify(updatedSavedRests));
    } catch (error) {
      console.error("Error deleting culinary Restaurant:", error);
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

  return (
    <SafeAreaView style={{
      flex: 1,
      paddingHorizontal: dimensions.width * 0.05,
      width: dimensions.width,
    }}>
      <View style={{ marginTop: dimensions.height * 0.1 }}></View>
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
          Saved Restaurants:
        </Text>
      </View>


      {savedCulinaryRestaurats.length === 0 ? (
        <>
          <Text
            style={{
              fontFamily: fontK2DRegular,
              color: '#C6C6C6',
              fontSize: dimensions.width * 0.044,
              textAlign: 'center',
              alignSelf: 'center',
              fontWeight: 400,
              paddingVertical: dimensions.height * 0.014,
              marginTop: dimensions.height * 0.01,
            }}>
            There is no content right now
          </Text>

          <TouchableOpacity style={{
            width: dimensions.width * 0.9,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
            onPress={() => setSelectedCulinaryScreen('Home')}
          >
            <Text
              style={{
                fontFamily: fontK2DRegular,
                color: 'white',
                fontSize: dimensions.width * 0.041,
                textAlign: 'center',
                alignSelf: 'center',
                fontWeight: 400,
                marginTop: dimensions.height * 0.01,
              }}>
              Back to explorer
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <ScrollView style={{
          width: dimensions.width,
          alignSelf: 'center',
        }} contentContainerStyle={{
          paddingBottom: dimensions.height * 0.16,
        }} showsVerticalScrollIndicator={false}>
          {savedCulinaryRestaurats.map((savedRest, index) => (
            <View key={savedRest.id} style={{
              width: dimensions.width * 0.9,
              alignSelf: 'center',
              borderRadius: dimensions.width * 0.04,
              backgroundColor: '#39383D',
              marginTop: dimensions.height * 0.021,
              shadowColor: '#111',
              shadowOffset: {
                width: 0,
                height: dimensions.height * 0.005,
              },
              shadowOpacity: 0.3,
              shadowRadius: dimensions.width * 0.01,
              elevation: 5,
            }}>
              <Image
                source={savedRest.image}
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
                  {savedRest.title}
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
                  {savedRest.description}
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
                    star <= savedRest.rating ? (
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
                      handleDeleteCulinaryRestaurant(savedRest.id);
                    }}
                    style={{
                      padding: dimensions.width * 0.04,
                      width: dimensions.width * 0.14,
                      height: dimensions.width * 0.14,
                      backgroundColor: '#F15257',
                      borderRadius: dimensions.width * 0.035,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <LinearGradient
                      colors={['#CCA65A', '#FDFADD']}
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
                        source={require('../assets/icons/blackHeartIcon.png')}
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
                      setSelectedCulinaryRestaurat(savedRest);
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
                      shareCulinaryRestaurant(savedRest.title);
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
          ))}
        </ScrollView>
      )
      }

    </SafeAreaView >
  );
};

export default FavouritesScreen;
