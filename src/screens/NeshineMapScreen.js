import React, { useEffect, useMemo, useState } from 'react';
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
const fontKarlaLight = 'Karla-Light';
const fontKarlaExtraLight = 'Karla-ExtraLight';

const NeshineMapScreen = ({ selectedCulinaryRestaurat, setSelectedCulinaryScreen, isCulinaryMapRestaurantVisible, setIsCulinaryMapRestaurantVisible, setSavedCulinaryRestaurats, savedCulinaryRestaurats }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const shareCulinaryRestaurant = async (title) => {
        try {
            await Share.share({
                message: `Let's go to the restaurant ${title}! I found it on the Culinary Crovvn - Melbourn!`,
            });
        } catch (error) {
            console.error('Error share:', error);
        }
    };

    const isCulinaryMapRestSaved = (thisRest) => {
        return savedCulinaryRestaurats.some((kn) => kn.id === thisRest?.id);
    };

    const saveNeshineMapPlace = async (rest) => {
        try {
            const savedMapRest = await AsyncStorage.getItem('savedCulinaryRestaurats');
            const parsedMapRests = savedMapRest ? JSON.parse(savedMapRest) : [];

            const thisMapRestIndex = parsedMapRests.findIndex((r) => r.id === rest.id);

            if (thisMapRestIndex === -1) {
                const updatedMapSavedRests = [rest, ...parsedMapRests];
                await AsyncStorage.setItem('savedCulinaryRestaurats', JSON.stringify(updatedMapSavedRests));
                setSavedCulinaryRestaurats(updatedMapSavedRests);
            } else {
                const updatedMapSavedRests = parsedMapRests.filter((r) => r.id !== rest.id);
                await AsyncStorage.setItem('savedCulinaryRestaurats', JSON.stringify(updatedMapSavedRests));
                setSavedCulinaryRestaurats(updatedMapSavedRests);
            }
        } catch (error) {
            console.error('error of save/delete map rest:', error);
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
                    latitude: selectedCulinaryRestaurat ? selectedCulinaryRestaurat.coordinates.latitude : allCulinaryRestaurantsData[0].coordinates.latitude,
                    longitude: selectedCulinaryRestaurat ? selectedCulinaryRestaurat.coordinates.longitude : allCulinaryRestaurantsData[0].coordinates.longitude,
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
                        pinColor={selectedCulinaryRestaurat && location.coordinates === selectedCulinaryRestaurat.coordinates ? "#181818" : "#FDCC06"}
                    />
                ))}
            </MapView>
            {isCulinaryMapRestaurantVisible && (
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
                            source={selectedCulinaryRestaurat?.image}
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
                                {selectedCulinaryRestaurat?.title}
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
                                {selectedCulinaryRestaurat?.description}
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
                                        setIsCulinaryMapRestaurantVisible(false);
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
                                        saveNeshineMapPlace(selectedCulinaryRestaurat);
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
                                        backgroundColor: isCulinaryMapRestSaved(selectedCulinaryRestaurat) ? '#FDCC06' : 'transparent',
                                        borderWidth: !isCulinaryMapRestSaved(selectedCulinaryRestaurat) ? dimensions.width * 0.003 : 0,
                                    }}>
                                    <Image
                                        source={isCulinaryMapRestSaved(selectedCulinaryRestaurat)
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
                                        shareCulinaryRestaurant(selectedCulinaryRestaurat?.title)
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
