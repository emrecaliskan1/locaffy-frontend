import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  // Uygulama başlangıcında tema tercihini yükle
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Tema yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Tema kaydedilirken hata:', error);
    }
  };

  const theme = {
    isDarkMode,
    colors: isDarkMode ? darkColors : lightColors,
  };

  const value = {
    isDarkMode,
    theme,
    toggleTheme,
    loading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Light Theme Colors
const lightColors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  card: '#FFFFFF',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  textTertiary: '#95A5A6',
  primary: '#667eea',
  primaryDark: '#5a67d8',
  accent: '#E74C3C',
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  border: '#E1E8ED',
  borderLight: '#F1F5F9',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  statusBar: 'dark-content',
};

// Dark Theme Colors
const darkColors = {
  background: '#1A1A1A',
  surface: '#2D2D2D',
  card: '#333333',
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textTertiary: '#8A8A8A',
  primary: '#667eea',
  primaryDark: '#5a67d8',
  accent: '#E74C3C',
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  border: '#404040',
  borderLight: '#4A4A4A',
  shadow: 'rgba(255, 255, 255, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  statusBar: 'light-content',
};