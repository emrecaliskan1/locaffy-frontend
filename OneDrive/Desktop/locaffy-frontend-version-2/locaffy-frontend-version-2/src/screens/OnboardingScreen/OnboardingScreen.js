import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export default function OnboardingScreen({ navigation }) {
  const [currentPage, setCurrentPage] = useState(0);

  // keep slides in code but disable the 'Siparişini Ver' slide for now
  const pages = [
    {
      title: 'Yakındaki Lezzetleri Keşfet',
      subtitle: 'Bulunduğun konuma en yakın restoranları ve kafeleri bul',
      icon: '📍',
      enabled: true
    },
    {
      title: 'Kolayca Rezervasyon Yap',
      subtitle: 'Sadece birkaç dokunuşla masanı rezerve et',
      icon: '📅',
      enabled: true
    },
    {
      title: 'Siparişini Ver',
      subtitle: 'Menüye bak, siparişini ver, masanda bekle',
      icon: '🛒',
      enabled: false // disabled: keep code but don't show this slide
    }
  ];

  // only show enabled pages in the onboarding flow
  const visiblePages = pages.filter(p => p.enabled);

  const handleNext = () => {
    if (!visiblePages || visiblePages.length === 0) {
      navigation.replace('Auth');
      return;
    }

    if (currentPage < visiblePages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigation.replace('Auth');
    }
  };

  const handleSkip = () => {
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Atla</Text>
      </TouchableOpacity>

      <View style={styles.contentContainer}>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>L</Text>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>{(visiblePages[currentPage] || visiblePages[0]).icon}</Text>
          </View>
        </View>

  <Text style={styles.title}>{(visiblePages[currentPage] || visiblePages[0]).title}</Text>

  <Text style={styles.subtitle}>{(visiblePages[currentPage] || visiblePages[0]).subtitle}</Text>

        <View style={styles.paginationContainer}>
          {visiblePages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentPage ? styles.activeDot : styles.inactiveDot
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
          <Text style={styles.continueText}>
            {currentPage === (visiblePages.length - 1) ? 'Başlayalım' : 'Devam Et'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}