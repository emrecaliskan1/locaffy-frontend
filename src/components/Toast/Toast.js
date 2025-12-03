import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// TOASTIFY BİLDİRİM COMPONENTİ

const Toast = ({ visible, message, type = 'success', duration = 1000, onHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
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
          onHide && onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, fadeAnim, slideAnim, onHide]);

  if (!visible) return null;

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#fff',
          borderLeftColor: '#4CAF50',
        };
      case 'error':
        return {
          backgroundColor: '#fff',
          borderLeftColor: '#f44336',
        };
      case 'warning':
        return {
          backgroundColor: '#fff',
          borderLeftColor: '#FF9800',
        };
      case 'info':
        return {
          backgroundColor: '#fff',
          borderLeftColor: '#2196F3',
        };
      default:
        return {
          backgroundColor: '#fff',
          borderLeftColor: '#2196F3',
        };
    }
  };

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { name: 'check-circle', color: '#4CAF50' };
      case 'error':
        return { name: 'times-circle', color: '#f44336' };
      case 'warning':
        return { name: 'exclamation-triangle', color: '#FF9800' };
      case 'info':
        return { name: 'info-circle', color: '#2196F3' };
      default:
        return { name: 'info-circle', color: '#2196F3' };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        getToastStyle(),
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <FontAwesome name={iconConfig.name} size={20} color={iconConfig.color} />
      <Text style={[styles.message, { color: iconConfig.color }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 99999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
});

export default Toast;