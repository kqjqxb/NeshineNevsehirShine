import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
} from 'react-native';

const GalleryScreen = ({ galeryData }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  const shareNeshineGallery = async (title) => {
    try {
      await Share.share({
        message: `Watch beautiful photos of ${title} on the NeShine - Nevşehir Shine!`,
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
      <ScrollView style={{
        width: dimensions.width,
        alignSelf: 'center',
      }} contentContainerStyle={{
        paddingBottom: dimensions.height * 0.16,
      }} showsVerticalScrollIndicator={false}>
        {galeryData.map((galElement, index) => (
          <View key={galElement.id} style={{
            alignSelf: 'center',
            width: dimensions.width * 0.9,
            backgroundColor: '#39383D',
            marginTop: dimensions.height * 0.016,
            borderRadius: dimensions.width * 0.04,
            shadowColor: '#111',
            shadowOffset: {
              width: 0,
              height: dimensions.height * 0.007,
            },
            shadowOpacity: 0.88,
            shadowRadius: dimensions.width * 0.03,
            elevation: 5,
            borderColor: 'white',
            borderWidth: dimensions.width * 0.005,
          }}>
            <Image
              source={galElement?.image}
              style={{
                width: '100%',
                height: dimensions.height * 0.25,
                borderRadius: dimensions.width * 0.04,
              }}
              resizeMode="stretch"
            />

            <TouchableOpacity
              onPress={() => {
                shareNeshineGallery(galElement?.title)
              }}
              style={{
                padding: dimensions.width * 0.04,
                width: dimensions.width * 0.14,
                height: dimensions.width * 0.14,
                backgroundColor: '#181818',
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
                borderColor: 'white',
                borderWidth: dimensions.width * 0.003,
                position: 'absolute',
                bottom: dimensions.height * 0.019,
                right: dimensions.width * 0.037,
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
        ))}
      </ScrollView>
    </SafeAreaView >
  );
};

export default GalleryScreen;
