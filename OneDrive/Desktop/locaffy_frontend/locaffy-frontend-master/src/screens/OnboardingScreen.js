import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      image: require('../../assets/korean.jpeg'),
      title: 'Yakındaki Lezzetleri Keşfet',
      subtitle: 'Bulunduğun konuma en yakın restoranları ve kafeleri bul',
      icon: '📍'
    },
    {
      image: require('../../assets/korean.jpeg'),
      title: 'Kolayca Rezervasyon Yap',
      subtitle: 'Sadece birkaç dokunuşla masanı rezerve et',
      icon: '📅'
    },
    {
      image: require('../../assets/korean.jpeg'),
      title: 'Siparişini Ver',
      subtitle: 'Menüye bak, siparişini ver, masanda bekle',
      icon: '🛒'
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
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Atla</Text>
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Image Card */}
        <View style={styles.imageCard}>
          <Image 
            source={pages[currentPage].image} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>{pages[currentPage].icon}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{pages[currentPage].title}</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{pages[currentPage].subtitle}</Text>

        {/* Pagination Dots */}
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

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
          <Text style={styles.continueText}>
            {currentPage === pages.length - 1 ? 'Başlayalım' : 'Devam Et'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  imageCard: {
    width: width * 0.9,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 24,
    marginBottom: 40,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FF6B35',
  },
  inactiveDot: {
    backgroundColor: '#DDD',
  },
  continueButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  continueText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
