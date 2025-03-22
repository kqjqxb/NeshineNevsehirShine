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

const NeshineFavouritesScreen = ({ setSelectedNeshineScreen, savedNeshinePlaces, setSavedNeshinePlaces, setIsNeshineMapPlaceVisible, setSelectedNeshinePlace }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  const handleDeleteNeshinePlace = async (id) => {
    try {
      const updatedSavedNeshinePlaces = savedNeshinePlaces.filter(nPl => nPl.id !== id);
      setSavedNeshinePlaces(updatedSavedNeshinePlaces);
      await AsyncStorage.setItem('savedNeshinePlaces', JSON.stringify(updatedSavedNeshinePlaces));
    } catch (error) {
      console.error("Error deleting neshine place:", error);
    }
  };

  const shareNeshinePlace = async (title) => {
    try {
      await Share.share({
        message: `I like ${title} place! I found this place in the NeShine - Nevşehir Shine!`,
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
      {savedNeshinePlaces.length === 0 ? (
        <>
          <Text
            style={{
              fontFamily: fontKarlaRegular,
              color: '#C6C6C6',
              fontSize: dimensions.width * 0.044,
              marginTop: dimensions.height * 0.01,
              alignSelf: 'center',
              fontWeight: 400,
              paddingVertical: dimensions.height * 0.014,
              textAlign: 'center',
            }}>
            There is nothing right now
          </Text>

          <TouchableOpacity style={{
            width: dimensions.width * 0.9,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
            onPress={() => setSelectedNeshineScreen('Home')}
          >
            <Text
              style={{
                marginTop: dimensions.height * 0.01,
                color: 'white',
                fontSize: dimensions.width * 0.041,
                alignSelf: 'center',
                fontWeight: 400,
                textAlign: 'center',
                textDecorationLine: 'underline',
                fontFamily: fontKarlaRegular,
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
          {savedNeshinePlaces.map((favNeshinePlace, index) => (
            <View key={favNeshinePlace.id} style={{
              width: dimensions.width * 0.9,
              alignSelf: 'center',
              backgroundColor: '#181818',
              borderRadius: dimensions.width * 0.037,
              marginTop: dimensions.height * 0.021,
              shadowOffset: {
                width: 0,
                height: dimensions.height * 0.007,
              },
              shadowOpacity: 0.88,
              shadowRadius: dimensions.width * 0.03,
              shadowColor: '#111',
              borderColor: 'white',
              borderWidth: dimensions.width * 0.003,
              elevation: 7,
            }}>
              <Image
                source={favNeshinePlace?.image}
                style={{
                  width: '100%',
                  height: dimensions.height * 0.241,
                  borderTopRightRadius: dimensions.width * 0.037,
                  borderTopLeftRadius: dimensions.width * 0.037,
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
                    fontFamily: fontKarlaRegular,
                    alignSelf: 'flex-start',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: "left",
                    fontSize: dimensions.width * 0.053,
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  {favNeshinePlace?.title}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: fontKarlaExtraLight,
                    alignItems: 'center',
                    marginTop: dimensions.height * 0.005,
                    alignSelf: 'flex-start',
                    fontSize: dimensions.width * 0.043,
                    maxWidth: dimensions.width * 0.8,
                    justifyContent: 'center',
                    textAlign: "left",
                  }}
                >
                  {favNeshinePlace?.description}
                </Text>

                <View style={{
                  width: '100%',
                  marginTop: dimensions.height * 0.0241,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedNeshinePlace(favNeshinePlace);
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
                      handleDeleteNeshinePlace(favNeshinePlace.id);
                    }}
                    style={{
                      height: dimensions.width * 0.140,
                      backgroundColor: '#FDCC06',
                      borderRadius: dimensions.width * 0.035,
                      padding: dimensions.width * 0.037,
                      alignItems: 'center',
                      width: dimensions.width * 0.140,
                      justifyContent: 'center',
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
                      shareNeshinePlace(favNeshinePlace?.title)
                    }}
                    style={{
                      alignItems: 'center',
                      height: dimensions.width * 0.140,
                      padding: dimensions.width * 0.037,
                      width: dimensions.width * 0.140,
                      borderRadius: dimensions.width * 0.035,
                      shadowColor: '#111',
                      justifyContent: 'center',
                      backgroundColor: '#2F2E31',
                      shadowOffset: {
                        width: 0,
                        height: dimensions.height * 0.004,
                      },
                      borderColor: '#fff',
                      shadowOpacity: 0.3,
                      elevation: 5,
                      shadowRadius: dimensions.width * 0.0005,
                      backgroundColor: 'transparent',
                      borderWidth: dimensions.width * 0.003,
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
          ))}
        </ScrollView>
      )}
    </SafeAreaView >
  );
};

export default NeshineFavouritesScreen;
