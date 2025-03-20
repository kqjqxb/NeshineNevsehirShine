import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Platform } from 'react-native';
import culinaryMelbourneOnboardingData from '../components/culinaryMelbourneOnboardingData';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const fontKarlaRegular = 'Karla-Regular';

const OnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    const dimensionListener = Dimensions.addEventListener('change', onChange);
    return () => {
      dimensionListener.remove();
    };
  }, []);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentSlideIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToTheNextCulinarySlide = () => {
    if (currentSlideIndex < culinaryMelbourneOnboardingData.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentSlideIndex + 1 });
    } else {
      navigation.navigate('Home');
    }
  };


  const renderCulinaryItem = ({ item }) => (
    <View style={{ width: dimensions.width, flex: 1, justifyContent: 'space-between', alignItems: 'center' }} >
      <View style={{
        width: dimensions.width,
        height: dimensions.height * 0.5,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
        <Image
          resizeMode="stretch"
          source={item.image}
          style={{
            height: dimensions.height * 0.5,
            width: dimensions.width,
          }}
        />
      </View>

      <View style={{
        position: 'absolute',
        alignSelf: 'center',
        bottom: 0,
        borderTopRightRadius: dimensions.width * 0.035,
        borderTopLeftRadius: dimensions.width * 0.035,
        alignItems: 'center',
        height: dimensions.height * 0.4321,
        width: dimensions.width,
        height: dimensions.height * 0.55,
        alignSelf: 'center',
        backgroundColor: '#181818',
        zIndex: 1,
        shadowColor: '#FDCC06',
        shadowOffset: { width: 0, height: -dimensions.height * 0.0019 },
        shadowOpacity: 1,
        shadowRadius: dimensions.height * 0.0001,
        elevation: 10,
      }}>
        <Text
          style={{
            marginTop: dimensions.height * 0.03,
            maxWidth: dimensions.width * 0.8,
            fontSize: dimensions.width * 0.064,
            fontFamily: fontKarlaRegular,
            fontWeight: 600,
            color: 'white',
            textAlign: 'center',
          }}>
          {item.title}
        </Text>
        <Text
          style={{
            color: '#fff',
            fontSize: dimensions.width * 0.043,
            marginTop: dimensions.height * 0.007,
            paddingHorizontal: dimensions.width * 0.1,
            top: dimensions.height * 0.019,
            textAlign: 'center',
            fontFamily: fontKarlaRegular,
          }}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={{ justifyContent: 'space-between', flex: 1, backgroundColor: '#121212', alignItems: 'center', }}
    >
      <View style={{ display: 'flex' }}>
        <FlatList
          data={culinaryMelbourneOnboardingData}
          renderItem={renderCulinaryItem}
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={slidesRef}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          if (currentSlideIndex === culinaryMelbourneOnboardingData.length - 1) {
            navigation.navigate('Home');
          } else scrollToTheNextCulinarySlide();
        }}
        style={{
          bottom: dimensions.height * 0.19,
          borderRadius: dimensions.width * 0.04,
          height: dimensions.height * 0.07,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 40,
          alignSelf: 'center',
        }}
      >
        <LinearGradient
          colors={['#FFF0B5', '#FDCC06']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            borderRadius: dimensions.width * 0.1,
            width: dimensions.width * 0.7,
            height: dimensions.height * 0.07,
            position: 'absolute',
            bottom: 0,
            alignSelf: 'center',
          }}
        />
        <Text
          style={{
            fontFamily: fontKarlaRegular,
            color: 'black',
            fontSize: dimensions.width * 0.046,
            textAlign: 'center',
            fontWeight: 600
          }}>
          { currentSlideIndex === culinaryMelbourneOnboardingData.length - 1 ? 'Get Started' : 'Next →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen;
