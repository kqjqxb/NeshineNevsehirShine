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

const neshineAppLink = 'https://apps.apple.com/us/app/neshine-nev%C5%9Fehir-shine/id6743625816'

const WelcomePageScreen = ({ setSelectedNeshineScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  const shareApp = async () => {
      try {
        await Share.share({
          message: `Join NeShine - Nevşehir Shine! \n${neshineAppLink}`,
        });
      } catch (error) {
        console.error('Error share neshine:', error);
      }
    };

  return (
    <SafeAreaView style={{
      flex: 1,
      paddingHorizontal: dimensions.width * 0.05,
      width: dimensions.width,
    }}>
      <Image
        source={require('../assets/images/welcomeImage.png')}
        style={{
          width: dimensions.width,
          height: dimensions.height * 0.25,
        }}
        resizeMode='contain'
      />

      <Text
        style={{
          fontFamily: fontKarlaRegular,
          color: 'white',
          fontSize: dimensions.width * 0.055,
          textAlign: 'left',
          alignSelf: 'flex-start',
          fontWeight: 600,
          paddingVertical: dimensions.height * 0.014,
          marginTop: -dimensions.height * 0.019,
          paddingHorizontal: dimensions.width * 0.07,
        }}>
        Welcome to Nevşehir: The Heart of Cappadocia 🌟
      </Text>

      <Text
        style={{
          fontFamily: fontKarlaRegular,
          color: '#C9C9C9',
          fontSize: dimensions.width * 0.044,
          textAlign: 'left',
          alignSelf: 'flex-start',
          fontWeight: 400,
          paddingVertical: dimensions.height * 0.014,
          marginTop: -dimensions.height * 0.016,
          paddingLeft: dimensions.width * 0.07,
          paddingRight: dimensions.width * 0.05,
        }}>
        Nestled in the heart of Cappadocia, Nevşehir is a city where history, nature, and culture intertwine to create a truly magical experience. Known for its breathtaking landscapes, ancient cave dwellings, and rich traditions, Nevşehir is more than just a destination—it's a journey through time.
      </Text>
      <TouchableOpacity
        onPress={() => {
          setSelectedNeshineScreen('Home');
        }}
        style={{
          elevation: 5,
          justifyContent: 'center',
          alignItems: 'center',
          shadowOffset: { width: 0, height: dimensions.height * 0.0021 },
          shadowOpacity: 0.4,
          alignSelf: 'center',
          shadowRadius: dimensions.width * 0.03,
          shadowColor: '#FDCC06',
        }}
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
              zIndex: 12,
              fontSize: dimensions.width * 0.05,
              textAlign: 'center',
              fontFamily: fontKarlaRegular,
              fontWeight: 600,
              color: 'black',
            }}>
            Explore
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          shareApp();
        }}
        style={{
          justifyContent: 'center',
          shadowOpacity: 0.4,
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: dimensions.height * 0.01,
        }}
      >
        <LinearGradient
          colors={['#3D3D3D', '#1E1E1E']}
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
              color: 'white',
              fontSize: dimensions.width * 0.05,
              textAlign: 'center',
              fontWeight: 600,
              zIndex: 10
            }}>
            Share app
          </Text>
        </LinearGradient>
      </TouchableOpacity>

    </SafeAreaView >
  );
};

export default WelcomePageScreen;
