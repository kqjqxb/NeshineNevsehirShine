import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    Share,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import mysticWondersData from '../components/mysticWondersData';
import goldenHeritageData from '../components/goldenHeritageData';
import sunsetSerenityData from '../components/sunsetSerenityData';
import localDelightsData from '../components/localDelightsData';

const allCulinaryRestaurantsData = [...mysticWondersData, ...goldenHeritageData, ...sunsetSerenityData, ...localDelightsData];

const fontKarlaRegular = 'Karla-Regular';
const fontKarlaExtraLight = 'Karla-ExtraLight';

const NeshineMapScreen = ({ selectedNeshinePlace, setSelectedNeshineScreen, isNeshineMapPlaceVisible, setIsNeshineMapPlaceVisible, setSavedNeshinePlaces, savedNeshinePlaces }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const shareNeshinePlace = async (title) => {
        try {
          await Share.share({
            message: `I like ${title}! Join NeShine - Nevşehir Shine!`,
          });
        } catch (error) {
          console.error('Error share:', error);
        }
      };

    const isNeshinePlaceSaved = (thisRest) => {
        return savedNeshinePlaces.some((kn) => kn.id === thisRest?.id);
    };

    const saveNeshineMapPlace = async (neshPlace) => {
        try {
            const savedTheseNeshinePlaces = await AsyncStorage.getItem('savedNeshinePlaces');
            const parsedNeshinePlaces = savedTheseNeshinePlaces ? JSON.parse(savedTheseNeshinePlaces) : [];

            const thisNeshinePlaceIndex = parsedNeshinePlaces.findIndex((r) => r.id === neshPlace.id);

            if (thisNeshinePlaceIndex === -1) {
                const updatedNeshinePlaces = [neshPlace, ...parsedNeshinePlaces];
                await AsyncStorage.setItem('savedNeshinePlaces', JSON.stringify(updatedNeshinePlaces));
                setSavedNeshinePlaces(updatedNeshinePlaces);
            } else {
                const updatedNeshinePlaces = parsedNeshinePlaces.filter((r) => r.id !== neshPlace.id);
                await AsyncStorage.setItem('savedNeshinePlaces', JSON.stringify(updatedNeshinePlaces));
                setSavedNeshinePlaces(updatedNeshinePlaces);
            }
        } catch (error) {
            console.error('error of save/delete neshine place:', error);
        }
    };

    return (
        <SafeAreaView style={{ width: dimensions.width }}>
            <MapView
                style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.01,
                    zIndex: 50
                }}
                region={{
                    latitude: selectedNeshinePlace ? selectedNeshinePlace.coordinates.latitude : allCulinaryRestaurantsData[0].coordinates.latitude,
                    longitude: selectedNeshinePlace ? selectedNeshinePlace.coordinates.longitude : allCulinaryRestaurantsData[0].coordinates.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >

                {allCulinaryRestaurantsData.map((location, index) => (
                    <Marker
                        key={index}
                        coordinate={location.coordinates}
                        title={location.title}
                        description={location.description}
                        pinColor={selectedNeshinePlace && location.coordinates === selectedNeshinePlace.coordinates ? "#181818" : "#FDCC06"}
                    />
                ))}
            </MapView>
            {isNeshineMapPlaceVisible && (
                <View style={{
                    width: dimensions.width * 0.9,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    position: 'absolute',
                    top: dimensions.height * 0.055,
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
                            source={selectedNeshinePlace?.image}
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
                                {selectedNeshinePlace?.title}
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
                                {selectedNeshinePlace?.description}
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
                                        setIsNeshineMapPlaceVisible(false);
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
                                            Close
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        saveNeshineMapPlace(selectedNeshinePlace);
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
                                        backgroundColor: isNeshinePlaceSaved(selectedNeshinePlace) ? '#FDCC06' : 'transparent',
                                        borderWidth: !isNeshinePlaceSaved(selectedNeshinePlace) ? dimensions.width * 0.003 : 0,
                                    }}>
                                    <Image
                                        source={isNeshinePlaceSaved(selectedNeshinePlace)
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
                                        shareNeshinePlace(selectedNeshinePlace?.title)
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
                </View>
            )}
        </SafeAreaView>
    );
};

export default NeshineMapScreen;
