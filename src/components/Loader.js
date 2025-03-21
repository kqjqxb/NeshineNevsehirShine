import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';

const Loader = () => {
  const rotation = useRef(new Animated.Value(0)).current;
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff', // adjust as needed
      marginVertical: dimensions.height * 0.07,
    }}>
      <View style={{
        position: 'relative',
        width: 150,
        height: 150,
        backgroundColor: 'transparent',
        borderRadius: 45, // ~30% of 150
        borderWidth: 1,
        borderColor: '#ecc904',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginVertical: 100,
      }}>
        <View style={{
          position: 'absolute',
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#b0a1a1',
          borderStyle: 'dashed',
          borderRadius: 45,
        }} />
        <View style={{
          position: 'absolute',
          width: 50,
          height: 50,
          borderRadius: 15, // ~30% of 50
          borderWidth: 1,
          borderColor: '#d6d3d3',
          borderStyle: 'dashed',
        }} />
        <Animated.View style={[styles.orbit, { transform: [{ rotate: spin }] }]}>
          <View style={{
            position: 'absolute',
            top: 0, // places the dot at the top of the orbit container
            width: dimensions.width * 0.03,
            height: dimensions.width * 0.03,
            backgroundColor: '#f20303',
            borderRadius: 7.5,
            // simulate a blur effect using shadow (iOS) and elevation (Android)
            shadowColor: '#f20303',
            shadowOffset: { width: dimensions.width * 0.01, height: dimensions.width * 0.01 },
            shadowOpacity: 0.3,
            shadowRadius: dimensions.width * 0.1,
            elevation: 5,
          }} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderWrapper: {

  },
  loader: {

  },
  loaderBefore: {

  },
  loaderAfter: {

  },
  orbit: {
    position: 'absolute',
    width: 150,
    height: 150,
    alignItems: 'center', // centers the dot horizontally
  },
  dot: {

  },
});

export default Loader;