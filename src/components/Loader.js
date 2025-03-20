import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const ICON_WIDTH = 90;
const ICON_HEIGHT = 120;
const ANIMATION_DURATION = 1000;
const PAGE_COLOR = "rgba(229, 227, 209, 0.7)";

const Loader = () => {
  // Створюємо 6 елементів; перший і останній залишаємо без анімації
  const animatedValues = Array.from({ length: 6 }, (_, i) =>
    i === 0 || i === 5 ? null : useRef(new Animated.Value(0)).current
  );

  useEffect(() => {
    const animations = animatedValues
      .filter(anim => anim !== null)
      .map(anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

    // Нескінченна, плавна анімація із stagger без перерв (з скиданням перед кожним циклом)
    Animated.loop(
      Animated.stagger(150, animations),
      { resetBeforeIteration: true }
    ).start();
  }, [animatedValues]);

  // Оновлений SVG-шлях із заміненими літерами "З" на "Z" для правильного рендерингу
  const svgPath =
    "M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z " +
    "M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 " +
    "L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 " +
    "L71.5,81 Z " +
    "M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 " +
    "L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z " +
    "M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 " +
    "L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z";

  const renderIcon = (value, key) => {
    if (!value) {
      return (
        <View key={key} style={styles.iconWrapper}>
          <Svg width={ICON_WIDTH} height={ICON_HEIGHT} viewBox="0 0 90 120" fill='rgba(247,238,212,0.5)'>
            <Path d={svgPath} />
          </Svg>
        </View>
      );
    } else {
      const rotateY = value.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '0deg'],
      });
      const opacity = value.interpolate({
        inputRange: [0, 0.2, 0.35, 0.5, 1],
        outputRange: [0, 1, 0, 0, 0],
      });
      return (
        <Animated.View
          key={key}
          style={[
            styles.iconWrapper,
            {
              transform: [
                { perspective: 1000 },
                { translateX: ICON_WIDTH / 2 },
                { rotateY },
                { translateX: -ICON_WIDTH / 2 }
              ],
              opacity,
            },
          ]}
        >
          <Svg width={ICON_WIDTH} height={ICON_HEIGHT} viewBox="0 0 90 120" fill={PAGE_COLOR}>
            <Path d={svgPath} />
          </Svg>
        </Animated.View>
      );
    }
  };

  return (
    <View style={styles.loaderRoot}>
      <LinearGradient colors={['#CCA65A', '#FDFADD']} style={styles.loaderBackground}>
        <View style={styles.iconsContainer}>
          {[0, 1, 2, 3, 4, 5].map(index => renderIcon(animatedValues[index], index))}
        </View>
      </LinearGradient>
      <Text style={styles.loaderText}>Loading</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderRoot: {
    width: 200,
    height: 140,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(253, 250, 221, 0.3)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconsContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  iconWrapper: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  loaderText: {
    position: 'absolute',
    top: '100%',
    marginTop: 20,
    textAlign: 'center',
    color: '#6C7486',
  },
});

export default Loader;