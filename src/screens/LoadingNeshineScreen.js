import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, Image, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const LoadingNeshineScreen = ({ setSelectedNeshineScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  // Central images (do not include the star image here)
  const images = [
    require('../assets/images/starImage.png'),
    require('../assets/images/neshineLoadImage1.png'),
    require('../assets/images/neshineLoadImage2.png'),
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [starFinished, setStarFinished] = useState(false);
  const imageRef = useRef(null);
  const starRef = useRef(null);


  useEffect(() => {

    if (starFinished && currentImageIndex === images.length) {
      setSelectedNeshineScreen('Home');
    }
  }, [starFinished, currentImageIndex]);
  const starAnimation = {
    from: { translateY: -dimensions.height * 0.5, rotate: '0deg' },
    to: { translateY: dimensions.height * 1.2, rotate: '720deg' },
  };

  const onStarAnimationEnd = () => {
    setTimeout(() => {
      setStarFinished(true);
    }, 0);
  };

  useEffect(() => {
    if (starFinished) {
      // Delay before starting the first image fadeIn (optional)
      const timer = setTimeout(() => {
        if (imageRef.current) {
          imageRef.current.fadeIn(800).then(() => {
            // Wait a moment then fade out the image
            setTimeout(() => {
              imageRef.current.fadeOut(800).then(() => {
                // Move to the next image
                setCurrentImageIndex(prev => prev + 1);
              });
            }, 800);
          });
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [starFinished, currentImageIndex]);

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      width: '100%',
      zIndex: 1,
    }}>
      {starFinished && currentImageIndex < images.length && (
        <Animatable.Image
          ref={imageRef}
          key={currentImageIndex} 
          source={images[currentImageIndex]}
          style={{
            width: currentImageIndex === 0 ? dimensions.width * 0.4 : dimensions.width * 0.61,
            height: currentImageIndex === 0 ? dimensions.width * 0.4 : dimensions.width * 0.61,
            borderRadius: dimensions.width * 0.037,
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />
      )}

      <Animatable.View
        ref={starRef}
        animation={starAnimation}
        duration={2000}
        easing="linear"
        onAnimationEnd={onStarAnimationEnd}
        style={{
          position: 'absolute',
          top: 0,
          left: dimensions.width * 0.42,
          zIndex: 3,
        }}
      >
        <Image
          source={require('../assets/images/starImage.png')}
          style={{
            width: dimensions.width * 0.16,
            height: dimensions.width * 0.16,
          }}
          resizeMode="contain"
        />
      </Animatable.View>
    </View>
  );
};

export default LoadingNeshineScreen;
