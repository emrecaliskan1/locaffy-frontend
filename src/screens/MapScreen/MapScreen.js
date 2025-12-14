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
import { RestaurantModal, ModernMapView } from '../../components/Map';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from '../../context/LocationContext';

export default function MapScreen({ navigation }) {
  const { theme } = useTheme();
  const { currentLocation, hasLocationPermission, getLocationText } = useLocation();
  const [region, setRegion] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [infoCardVisible, setInfoCardVisible] = useState(false);
  const [infoCardAnimation] = useState(new Animated.Value(1));
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'error') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
  };

  useEffect(() => {
    initializeMap();
  }, [currentLocation]);

  const initializeMap = async () => {
    setLoading(true);
    setPlaces([]); 
    
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

  const loadPlaces = async () => {
    setPlacesLoading(true);
    setPlaces([]);
    try {
      // Şehir seçimi yapılmamışsa mekan yükleme
      if (!userLocation || !currentLocation) {
        return;
      }
      
      const lat = userLocation.latitude;
      const lng = userLocation.longitude;
      const result = await placeService.getNearbyPlaces(lat, lng, 10000, true);
      const places = Array.isArray(result) ? result : (result?.data ? (Array.isArray(result.data) ? result.data : []) : []);

      const availablePlaces = places.filter(place => place && place.isAvailable !== false);
      setPlaces(availablePlaces);
    } catch (error) {
      setPlaces([]);
    } finally {
      setPlacesLoading(false);
    }
  };

  // userLocation ve currentLocation değişikliklerini useEffect ile yönet
  useEffect(() => {
    if (userLocation && currentLocation) {
      const timer = setTimeout(() => {
        loadPlaces();
      }, 150);
      
      return () => clearTimeout(timer);
    } else {
      setPlaces([]);
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
                <Text style={styles.infoCardTitle}>Marker Kategorileri</Text>
                <TouchableOpacity 
                  style={styles.infoCardCloseButton} 
                  onPress={toggleInfoCard}
                >
                  <FontAwesome name="times" size={12} color="#666" />
                </TouchableOpacity>
              </View>
              
              {/* Bilgilendirme Kartı İçeriği */}
              <View style={styles.infoCardContent}>
                {categoryInfo.map((category, index) => (
                  <View key={index} style={styles.categoryRow}>
                    <View style={[styles.categoryIcon, { backgroundColor: theme.colors.primary }]}>
                      {category.iconFamily === 'FontAwesome5' ? (
                        <FontAwesome5 name={category.icon} size={14} color="#fff" />
                      ) : (
                        <FontAwesome name={category.icon} size={14} color="#fff" />
                      )}
                    </View>
                    <View style={styles.categoryText}>
                      <Text style={styles.categoryLabel}>{category.label}</Text>
                      <Text style={styles.categoryDescription}>{category.description}</Text>
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