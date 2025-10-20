import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Toast = ({ message, type = 'info', duration = 1000, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    // Giriş animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Belirtilen süre sonra çıkış animasyonu
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onHide) onHide();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim, slideAnim, duration, onHide]);

  const getToastColor = () => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'warning':
        return '#FF9800';
      default:
        return '#2196F3';
    }
  };

  const getToastIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'exclamation-circle';
      case 'warning':
        return 'exclamation-triangle';
      default:
        return 'info-circle';
    }
  };

  if (!message) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: getToastColor(),
        },
      ]}
    >
      <FontAwesome
        name={getToastIcon()}
        size={20}
        color="white"
        style={styles.icon}
      />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxWidth: width - 32,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Toast;