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

import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import modernFusionData from '../components/modernFusionData';
import herritageFlavorsData from '../components/herritageFlavorsData';
import coastalBitesData from '../components/coastalBitesData';
import hiddenGemsData from '../components/hiddenGemsData';

const allCulinaryRestaurantsData = [...modernFusionData, ...herritageFlavorsData, ...coastalBitesData, ...hiddenGemsData];

const fontK2DRegular = 'K2D-Regular';

const CulinaryMapScreen = ({ selectedCulinaryRestaurat, setSelectedCulinaryScreen, isCulinaryMapRestaurantVisible, setIsCulinaryMapRestaurantVisible, setSavedCulinaryRestaurats, savedCulinaryRestaurats }) => {
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

    const saveCulinaryMapRestaurant = async (rest) => {
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
            <View style={{
                zIndex: 50,
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                width: dimensions.width,

            }}>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedCulinaryScreen('Home');
                    }}
                    style={{
                        borderRadius: dimensions.width * 0.5,
                        zIndex: 100,
                        padding: dimensions.width * 0.04,
                        alignSelf: 'flex-start',
                    }}>
                    <ChevronLeftIcon size={dimensions.width * 0.07} color='white' />
                </TouchableOpacity>
                <Text
                    style={{
                        fontFamily: fontK2DRegular,
                        textAlign: "left",
                        fontSize: dimensions.width * 0.064,
                        alignSelf: 'center',
                        fontWeight: 700,
                        color: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: dimensions.width * 0.05

                    }}
                >
                    Cultural Places
                </Text>
            </View>
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
                        pinColor={selectedCulinaryRestaurat && location.coordinates === selectedCulinaryRestaurat.coordinates ? "#FFFCDD" : "#2F2E31"}
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
                    top: dimensions.height * 0.16,
                }}>
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
                            source={selectedCulinaryRestaurat?.image}
                            style={{
                                width: dimensions.width * 0.9,
                                alignSelf: 'center',
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
                                    paddingHorizontal: dimensions.width * 0.05,
                                }}
                            >
                                {selectedCulinaryRestaurat?.title}
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
                                    marginTop: dimensions.height * 0.005,
                                    paddingHorizontal: dimensions.width * 0.05,
                                }}
                            >
                                {selectedCulinaryRestaurat?.description}
                            </Text>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'flex-start',
                                marginTop: dimensions.height * 0.007,
                                paddingHorizontal: dimensions.width * 0.05,
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
                                    star <= selectedCulinaryRestaurat.rating ? (
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
                                width: dimensions.width * 0.9,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                alignSelf: 'center',
                                marginTop: dimensions.height * 0.025,
                                marginBottom: dimensions.height * 0.028,
                                paddingHorizontal: dimensions.width * 0.05,
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        saveCulinaryMapRestaurant(selectedCulinaryRestaurat);
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
                                        colors={isCulinaryMapRestSaved(selectedCulinaryRestaurat) ? ['#CCA65A', '#FFFCDD'] : ['transparent', 'transparent']}
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
                                            source={isCulinaryMapRestSaved(selectedCulinaryRestaurat)
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
                                        setIsCulinaryMapRestaurantVisible(false);
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
                                            Close
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    onPress={() => {
                                        shareCulinaryRestaurant(selectedCulinaryRestaurat?.title)
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
                </View>
            )}
        </SafeAreaView>
    );
};

export default CulinaryMapScreen;
