import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';

export const useFadeSlideAnimation = (initialFade = 0, initialSlide = 50, duration = 600) => {
  const fadeAnim = useRef(new Animated.Value(initialFade)).current;
  const slideAnim = useRef(new Animated.Value(initialSlide)).current;

  const animateIn = useCallback((customDuration = duration) => {
    return new Promise(resolve => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: customDuration,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: customDuration,
          useNativeDriver: true,
        }),
      ]).start(resolve);
    });
  }, [fadeAnim, slideAnim, duration]);

  const animateOut = useCallback((customDuration = duration) => {
    return new Promise(resolve => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: customDuration,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: initialSlide,
          duration: customDuration,
          useNativeDriver: true,
        }),
      ]).start(resolve);
    });
  }, [fadeAnim, slideAnim, initialSlide, duration]);

  // Component mount olduğunda otomatik animate
  const animateOnMount = useCallback(() => {
    animateIn();
  }, [animateIn]);

  return { 
    fadeAnim, 
    slideAnim, 
    animateIn, 
    animateOut,
    animateOnMount,
    animatedStyle: {
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }
  };
};

export default useFadeSlideAnimation;
