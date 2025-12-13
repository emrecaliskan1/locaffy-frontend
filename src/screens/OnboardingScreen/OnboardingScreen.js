import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from './styles';
import { useTheme } from '../../context/ThemeContext';

export default function OnboardingScreen({ navigation }) {
  const [currentPage, setCurrentPage] = useState(0);
  const { theme } = useTheme();

  const pages = [
    {
      title: 'Yakındaki Lezzetleri Keşfet',
      subtitle: 'Bulunduğun konuma en yakın restoranları veya kafeleri bul',
      icon: 'map-marker-alt'
    },
    {
      title: 'Kolayca Rezervasyon Yap',
      subtitle: 'Sadece birkaç dokunuşla masanı rezerve et',
      icon: 'calendar-alt'
    }
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigation.replace('Auth');
    }
  };

  const handleSkip = () => {
    navigation.replace('Auth');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background} />

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Atla</Text>
      </TouchableOpacity>

      <View style={styles.contentContainer}>

        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/locaffy.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary }]}>
            <FontAwesome5 name={pages[currentPage].icon} size={32} color="#FFFFFF" style={styles.iconText} />
          </View>
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]}>{pages[currentPage].title}</Text>

        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{pages[currentPage].subtitle}</Text>

        <View style={styles.paginationContainer}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentPage ? { backgroundColor: theme.colors.primary } : { backgroundColor: theme.colors.borderLight }
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={[styles.continueButton, { backgroundColor: theme.colors.primary }]} onPress={handleNext}>
          <Text style={[styles.continueText, { color: '#FFFFFF' }]}> 
            {currentPage === pages.length - 1 ? 'Başlayalım' : 'Devam Et'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}