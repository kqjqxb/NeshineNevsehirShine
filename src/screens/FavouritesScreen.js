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

const fontKarlaRegular = 'Karla-Regular';
const fontKarlaLight = 'Karla-Light';
const fontKarlaExtraLight = 'Karla-ExtraLight';

const FavouritesScreen = ({ setSelectedCulinaryScreen, savedCulinaryRestaurats, setSavedCulinaryRestaurats, setIsCulinaryMapRestaurantVisible, setSelectedCulinaryRestaurat }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isKnotVisible, setIsKnotVisible] = useState(false);
  const [selectedKnot, setSelectedKnot] = useState(null);


  const isNeshinePlaceSaved = (thisRest) => {
    return savedCulinaryRestaurats.some((r) => r.id === thisRest.id);
  };

  const handleDeleteNeshinePlace = async (id) => {
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
      {savedCulinaryRestaurats.length === 0 ? (
        <>
          <Text
            style={{
              fontFamily: fontKarlaRegular,
              color: '#C6C6C6',
              fontSize: dimensions.width * 0.044,
              textAlign: 'center',
              alignSelf: 'center',
              fontWeight: 400,
              paddingVertical: dimensions.height * 0.014,
              marginTop: dimensions.height * 0.01,
            }}>
            There is nothing right now
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
                fontFamily: fontKarlaRegular,
                color: 'white',
                fontSize: dimensions.width * 0.041,
                textAlign: 'center',
                alignSelf: 'center',
                fontWeight: 400,
                marginTop: dimensions.height * 0.01,
                textDecorationLine: 'underline',
              }}>
              Back home to add some places
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
          {savedCulinaryRestaurats.map((favNeshinePlace, index) => (
            <View key={favNeshinePlace.id} style={{
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
                source={favNeshinePlace?.image}
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
                  {favNeshinePlace?.title}
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
                  {favNeshinePlace?.description}
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
                      setSelectedCulinaryRestaurat(favNeshinePlace);
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
                      handleDeleteNeshinePlace(favNeshinePlace.id);
                    }}
                    style={{
                      height: dimensions.width * 0.140,
                      padding: dimensions.width * 0.037,
                      backgroundColor: '#2F2E31',
                      borderRadius: dimensions.width * 0.035,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: dimensions.width * 0.140,
                      backgroundColor: '#FDCC06'
                    }}>
                    <Image
                      source={require('../assets/icons/blackInappIcons/savedIcon.png')}
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
                      shareCulinaryRestaurant(favNeshinePlace?.title)
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
