import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import Toast from '../../components/Toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { FontAwesome, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { placeService } from '../../services/placeService';
import { calculateDistance } from '../../utils/distance';
import { RestaurantModal, ModernMapView } from '../../components/Map';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from '../../context/LocationContext';
import { useToast, usePlaces } from '../../hooks';

export default function MapScreen({ navigation }) {
  const { theme } = useTheme();
  const { currentLocation, hasLocationPermission, getLocationText, needsCitySelection } = useLocation();
  
  const { toast, showToast, hideToast } = useToast();
  const { 
    places, 
    loading: placesLoading, 
    loadPlaces: loadPlacesFromHook 
  } = usePlaces(currentLocation);
  
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [infoCardVisible, setInfoCardVisible] = useState(false);
  const [infoCardAnimation] = useState(new Animated.Value(1));
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);

  useEffect(() => {
    initializeMap();
  }, [currentLocation]);

  useEffect(() => {
    // Eğer currentLocation yoksa ve şehir seçimi gerekiyorsa, kullanıcıyı yönlendir
    if (!currentLocation && needsCitySelection) {
      navigation.navigate('CitySelectionModal', { isModal: true });
    }
  }, [currentLocation, needsCitySelection]);

  const initializeMap = async () => {
    setLoading(true);

    try {
      if (currentLocation) {
        // LocationContext'ten gelen konum var (seçilen şehir)
        setUserLocation({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        });

        setRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        setUserLocation(null);
        setRegion(null);
      }
    } catch (error) {
      console.error('Map initialization error:', error);
      setUserLocation(null);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast('Konum izni verilmedi. Seçilen şehir gösterilecek.', 'info');
        if (currentLocation) {
          setUserLocation({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude
          });
          setRegion({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      // Hata durumunda LocationContext'ten gelen konum kullanılacak
      if (currentLocation) {
        setUserLocation({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        });
      } else {
        setUserLocation(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // usePlaces hook'unu kullanarak mekanları yükle
  useEffect(() => {
    if (userLocation && currentLocation) {
      const timer = setTimeout(() => {
        loadPlacesFromHook(userLocation);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [userLocation, currentLocation?.latitude, currentLocation?.longitude]);

  const handleMarkerPress = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setModalVisible(true);
  };

  const handleViewDetails = (restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRestaurant(null);
  };

  const toggleInfoCard = () => {
    if (infoCardVisible) {
      Animated.timing(infoCardAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setInfoCardVisible(false));
    } else {
      setInfoCardVisible(true);
      Animated.timing(infoCardAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  // Map screendeki bilgilendirme Card'ı için
  const categoryInfo = [
    {
      types: ['RESTAURANT', 'BISTRO'],
      icon: 'cutlery',
      iconFamily: 'FontAwesome',
      label: 'Yemek',
      description: 'Restoran, Bistro'
    },
    {
      types: ['CAFE'],
      icon: 'coffee',
      iconFamily: 'FontAwesome',
      label: 'Kahve',
      description: 'Cafe'
    },
    {
      types: ['BAR'],
      icon: 'glass',
      iconFamily: 'FontAwesome',
      label: 'Bar',
      description: 'Bar, Alkollü mekanlar'
    },
    {
      types: ['DESSERT'],
      icon: 'birthday-cake',
      iconFamily: 'FontAwesome',
      label: 'Tatlı',
      description: 'Pastane, Tatlıcı'
    },
    {
      types: ['FASTFOOD'],
      icon: 'hamburger',
      iconFamily: 'FontAwesome5',
      label: 'Fast Food',
      description: 'Hızlı yemek'
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {getLocationText()}
          </Text>
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: theme.colors.background }]}
            onPress={getLocation}>
            <Image
              source={require('../../../assets/locaffyicon.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {loading || placesLoading ? (
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            {loading ? 'Konum alınıyor...' : 'Mekanlar yüklenyor...'}
          </Text>
        </View>
      ) : !region || !userLocation ? (
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Harita hazırlanıyor...
          </Text>
        </View>
      ) : (
        <>

          <ModernMapView
            restaurants={places}
            onMarkerPress={handleMarkerPress}
            userLocation={userLocation}
            region={region}
            styles={styles}
            onBottomSheetToggle={setBottomSheetExpanded}
          />

          {infoCardVisible && (
            <Animated.View
              style={[
                styles.infoCard,
                { backgroundColor: theme.isDarkMode ? '#333333' : '#FFFFFF' },
                {
                  opacity: infoCardAnimation,
                  transform: [{
                    translateY: infoCardAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    })
                  }]
                }
              ]}
            >
              {/* Bilgilendirme Kartı */}
              <View style={styles.infoCardHeader}>
                <Text style={[styles.infoCardTitle, { color: theme.colors.text }]}>Marker Kategorileri</Text>
                <TouchableOpacity
                  style={styles.infoCardCloseButton}
                  onPress={toggleInfoCard}
                >
                  <FontAwesome name="times" size={12} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Bilgilendirme Kartı İçeriği */}
              <View style={styles.infoCardContent}>
                {categoryInfo.map((category, index) => (
                  <View key={index} style={styles.categoryRow}>
                    <View style={[styles.categoryIcon, { backgroundColor: '#EA4335' }]}>
                      {category.iconFamily === 'FontAwesome5' ? (
                        <FontAwesome5 name={category.icon} size={14} color="#fff" />
                      ) : (
                        <FontAwesome name={category.icon} size={14} color="#fff" />
                      )}
                    </View>
                    <View style={styles.categoryText}>
                      <Text style={[styles.categoryLabel, { color: theme.colors.text }]}>{category.label}</Text>
                      <Text style={[styles.categoryDescription, { color: theme.colors.textSecondary }]}>{category.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {!infoCardVisible && !bottomSheetExpanded && (
            <TouchableOpacity
              style={[styles.infoToggleButton, { backgroundColor: theme.colors.card }]}
              onPress={toggleInfoCard}
            >
              <FontAwesome name="info-circle" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Restoran Modalı */}
      <RestaurantModal
        visible={modalVisible}
        restaurant={selectedRestaurant}
        onClose={closeModal}
        onViewDetails={handleViewDetails}
        styles={styles}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={3000}
        onHide={hideToast}
      />
    </View>
  );
}