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

import top5RestsData from '../components/top5RestsData';
import MapView, { Marker } from 'react-native-maps';

const fontK2DRegular = 'K2D-Regular';

const Top5RatingScreen = ({ setSelectedCulinaryScreen, savedCulinaryRestaurats, setSavedCulinaryRestaurats }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedMapId, setSelectedMapId] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(false);

  const isCulinaryRestaurantSaved = (thisRest) => {
    return savedCulinaryRestaurats.some((kn) => kn.id === thisRest?.id);
  };

  const saveTop5CulinaryRest = async (rest) => {
    try {
      const savedAllTop5Rests = await AsyncStorage.getItem('savedCulinaryRestaurats');
      const parsedTop5Rests = savedAllTop5Rests ? JSON.parse(savedAllTop5Rests) : [];

      const thisTop5RestIndex = parsedTop5Rests.findIndex((r) => r.id === rest.id);

      if (thisTop5RestIndex === -1) {
        const updatedSavedFromTop5Rests = [rest, ...parsedTop5Rests];
        await AsyncStorage.setItem('savedCulinaryRestaurats', JSON.stringify(updatedSavedFromTop5Rests));
        setSavedCulinaryRestaurats(updatedSavedFromTop5Rests);
      } else {
        const updatedSavedFromTop5Rests = parsedTop5Rests.filter((r) => r.id !== rest.id);
        await AsyncStorage.setItem('savedCulinaryRestaurats', JSON.stringify(updatedSavedFromTop5Rests));
        setSavedCulinaryRestaurats(updatedSavedFromTop5Rests);
      }
    } catch (error) {
      console.error('error of save/delete top5 rest:', error);
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
        marginBottom: dimensions.height * 0.01,
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
          Our Top-5 Rating:
        </Text>
      </View>

      <ScrollView style={{
        width: dimensions.width,
        alignSelf: 'center',
      }} contentContainerStyle={{
        paddingBottom: dimensions.height * 0.16,
      }} showsVerticalScrollIndicator={false}>
        {top5RestsData.map((top5Rest, index) => (
          <View key={top5Rest.id} style={{
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
              source={top5Rest?.image}
              style={{
                width: '100%',
                height: dimensions.height * 0.25,
                borderTopLeftRadius: dimensions.width * 0.04,
                borderTopRightRadius: dimensions.width * 0.04,
              }}
              resizeMode="stretch"
            />

            <LinearGradient
              colors={top5Rest?.gradients}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                width: dimensions.width * 0.14,
                height: dimensions.width * 0.14,
                zIndex: 0,
                borderRadius: dimensions.width * 0.034,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: dimensions.height * 0.016,
                left: dimensions.width * 0.016,
                shadowColor: '#111',
                shadowOffset: {
                  width: 0,
                  height: dimensions.height * 0.003,
                },
                shadowOpacity: 0.16,
                shadowRadius: dimensions.width * 0.01,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: fontK2DRegular,
                  textAlign: "center",
                  fontSize: dimensions.width * 0.046,
                  alignSelf: 'center',
                  fontWeight: 600,
                  color: '#2F2E31',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                #{top5Rest?.position}
              </Text>
            </LinearGradient>

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
                {top5Rest?.title}
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
                {top5Rest?.description}
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
                  star <= top5Rest.rating ? (
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
                    saveTop5CulinaryRest(top5Rest);
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
                    colors={isCulinaryRestaurantSaved(top5Rest) ? ['#CCA65A', '#FFFCDD'] : ['transparent', 'transparent']}
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
                      source={isCulinaryRestaurantSaved(top5Rest)
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
                    if (selectedMapId === top5Rest.id) {
                      setIsMapVisible(!isMapVisible);
                    } else {
                      setIsMapVisible(true);
                      setSelectedMapId(top5Rest.id);
                    }
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
                      {isMapVisible && selectedMapId === top5Rest.id ? 'Close Map' : 'Open map'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>


                <TouchableOpacity
                  onPress={() => {
                    shareCulinaryRestaurant(top5Rest?.title)
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

              {isMapVisible && selectedMapId === top5Rest.id && (
                <MapView
                  style={{
                    width: dimensions.width * 0.8,
                    height: dimensions.height * 0.16,
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.01,
                    zIndex: 50,
                    borderRadius: dimensions.width * 0.04,
                  }}
                  region={{
                    latitude: top5Rest.coordinates.latitude ,
                    longitude: top5Rest.coordinates.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    key={index}
                    coordinate={top5Rest.coordinates}
                    title={top5Rest.title}
                    description={top5Rest.description}
                    pinColor={"#39383D"}
                  />
                </MapView>
              )}
            </View>
          </View>
        ))}


      </ScrollView>

    </SafeAreaView >
  );
};

export default Top5RatingScreen;
