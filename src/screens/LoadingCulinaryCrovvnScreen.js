import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoadingCulinaryCrovvnScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();

  // Animated values for each loading image
  const opacity1 = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;
  const translateX2 = useRef(new Animated.Value(dimensions.width)).current;
  const opacity3 = useRef(new Animated.Value(0)).current;
  const opacity4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Функція для послідовного виконання анімації
    const runAnimations = async () => {
      // loading1 fade in
      await new Promise((resolve) => {
        Animated.timing(opacity1, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => resolve());
      });

      // loading2 wipe effect (translateX) та fade in одночасно
      await new Promise((resolve) => {
        Animated.parallel([
          Animated.timing(opacity2, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(translateX2, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => resolve());
      });

      // Затримка перед зникненням loading1 та loading2
      await new Promise((resolve) => setTimeout(resolve, 500));

      // fade out loading1 та loading2 одночасно
      await new Promise((resolve) => {
        Animated.parallel([
          Animated.timing(opacity1, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity2, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => resolve());
      });

      // fade in loading3
      await new Promise((resolve) => {
        Animated.timing(opacity3, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => resolve());
      });

      // Затримка для перегляду loading3
      await new Promise((resolve) => setTimeout(resolve, 500));

      // fade out loading3
      await new Promise((resolve) => {
        Animated.timing(opacity3, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => resolve());
      });

      // fade in loading4
      await new Promise((resolve) => {
        Animated.timing(opacity4, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => resolve());
      });

      // Затримка для демонстрації фінального стану, потім перехід на Home (як приклад)
      setTimeout(() => {
        navigation.replace('Home');
      }, 1000);
    };

    runAnimations();
  }, [navigation, opacity1, opacity2, translateX2, opacity3, opacity4]);

  // Розрахунок позицій для абсолютного центрування
  const imageSize = dimensions.width * 0.7;
  const centerTop = dimensions.height / 2 - imageSize / 2;
  const centerLeft = dimensions.width / 2 - imageSize / 2;
  const gap = 10; // відступ для image2

  return (
    <View style={{ flex: 1, backgroundColor: '#2F2E31' }}>
      {/* loading1 (завжди в центрі) */}
      <Animated.Image
        source={require('../assets/images/loadingImages/loading1.png')}
        resizeMode='contain'
        style={{
          position: 'absolute',
          top: centerTop,
          left: centerLeft,
          width: imageSize,
          height: imageSize,
          opacity: opacity1,
        }}
      />
      {/* loading2 (з'являється під loading1) */}
      <Animated.Image
        source={require('../assets/images/loadingImages/loading2.png')}
        resizeMode='contain'
        style={{
          position: 'absolute',
          top: centerTop + imageSize + gap - dimensions.height * 0.21,
          left: centerLeft,
          width: imageSize,
          height: imageSize,
          opacity: opacity2,
          transform: [{ translateX: translateX2 }],
        }}
      />
      {/* loading3 (завжди в центрі) */}
      <Animated.Image
        source={require('../assets/images/loadingImages/loading3.png')}
        resizeMode='contain'
        style={{
          position: 'absolute',
          top: centerTop,
          left: centerLeft,
          width: imageSize,
          height: imageSize,
          opacity: opacity3,
        }}
      />
      {/* loading4 (завжди в центрі) */}
      <Animated.Image
        source={require('../assets/images/loadingImages/loading4.png')}
        resizeMode='contain'
        style={{
          position: 'absolute',
          top: centerTop - dimensions.height * 0.07,
          alignSelf: 'center',
          width: imageSize * 1.4,
          height: imageSize * 1.4,
          opacity: opacity4,
        }}
      />
    </View>
  );
};

export default LoadingCulinaryCrovvnScreen;