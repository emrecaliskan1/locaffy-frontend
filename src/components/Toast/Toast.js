import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

// TOASTIFY BİLDİRİM COMPONENTİ

const Toast = ({ visible, message, type = 'success', duration = 1000, onHide }) => {
  const { theme, isDarkMode } = useTheme();
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

      // duration null veya 0 ise otomatik kapanmayı devre dışı bırak
      if (duration && duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [visible, duration, fadeAnim, slideAnim]);

  const handleClose = () => {
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
  };

  if (!visible) return null;

  const getToastStyle = () => {
    const bgColor = isDarkMode ? theme.colors.card : '#fff';
    const conflictBg = isDarkMode ? '#3D1F1F' : '#FFF5F5';
    const conflictBorder = isDarkMode ? '#7F1D1D' : '#FEE2E2';
    
    switch (type) {
      case 'success':
        return {
          backgroundColor: bgColor,
          borderLeftColor: '#4CAF50',
        };
      case 'error':
        return {
          backgroundColor: bgColor,
          borderLeftColor: '#f44336',
        };
      case 'warning':
        return {
          backgroundColor: bgColor,
          borderLeftColor: '#FF9800',
        };
      case 'info':
        return {
          backgroundColor: bgColor,
          borderLeftColor: '#2196F3',
        };
      case 'conflict':
        return {
          backgroundColor: conflictBg,
          borderLeftColor: '#EF4444',
          borderWidth: 1,
          borderColor: conflictBorder,
        };
      default:
        return {
          backgroundColor: bgColor,
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
      case 'conflict':
        return { name: 'exclamation-circle', color: '#EF4444' };
      case 'block':
        return { name: 'ban', color: '#EF4444' };
      default:
        return { name: 'info-circle', color: '#2196F3' };
    }
  };

  const iconConfig = getIconConfig();
  const isDismissible = !duration || duration === 0;

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
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome name={iconConfig.name} size={22} color={iconConfig.color} />
        </View>
        <Text 
          style={[styles.message, { color: type === 'conflict' ? (isDarkMode ? '#FCA5A5' : '#991B1B') : iconConfig.color }]}
          numberOfLines={0}
        >
          {message}
        </Text>
        {isDismissible && (
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome name="times" size={16} color={type === 'conflict' ? (isDarkMode ? '#FCA5A5' : '#991B1B') : (isDarkMode ? '#999' : '#666')} />
          </TouchableOpacity>
        )}
      </View>
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
    paddingVertical: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
    zIndex: 99999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 12,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
    marginTop: -2,
  },
});

export default Toast;