import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from './styles';

export default function OnboardingScreen({ navigation }) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: 'Yakındaki Lezzetleri Keşfet',
      subtitle: 'Bulunduğun konuma en yakın restoranları ve kafeleri bul',
      icon: 'map-marker-alt'
    },
    {
      title: 'Kolayca Rezervasyon Yap',
      subtitle: 'Sadece birkaç dokunuşla masanı rezerve et',
      icon: 'calendar-alt'
    },
    {
      title: 'Siparişini Ver',
      subtitle: 'Menüye bak, siparişini ver, masanda bekle',
      icon: 'shopping-cart'
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Atla</Text>
      </TouchableOpacity>

      <View style={styles.contentContainer}>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>L</Text>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name={pages[currentPage].icon} size={32} color="#667eea" style={styles.iconText} />
          </View>
        </View>

        <Text style={styles.title}>{pages[currentPage].title}</Text>

        <Text style={styles.subtitle}>{pages[currentPage].subtitle}</Text>

        <View style={styles.paginationContainer}>
          {pages.map((_, index) => (
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
            {currentPage === pages.length - 1 ? 'Başlayalım' : 'Devam Et'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}