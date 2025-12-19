import {
  View,
  Text,
  FlatList,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import FilterModal from '../../components/FilterModal';
import Toast from '../../components/Toast';
import { RestaurantCard, SearchHeader } from '../../components/Home';
import { placeService, userService } from '../../services';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from '../../context/LocationContext';
import { calculateDistance } from '../../utils/distance';
import { styles } from './styles';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { currentLocation, hasLocationPermission, getLocationText } = useLocation();
  const [searchText, setSearchText] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [places, setPlaces] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [appliedFilters, setAppliedFilters] = useState({
    category: 'all',
    rating: 'all',
    distance: 'all',
    openNow: false,
    features: {}
  });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
  };

  // Mekanları arama metni ve filtrelere göre filtrele
  const filteredRestaurants = places.filter(place => {
    if (place.isAvailable === false) return false;

    const matchesSearch = !searchText || place.name?.toLowerCase().includes(searchText.toLowerCase()) || false;
    const matchesCategory = appliedFilters.category === 'all' ||
      place.placeType?.toLowerCase() === appliedFilters.category.toLowerCase() ||
      place.placeType === appliedFilters.category.toUpperCase();
    const matchesRating = appliedFilters.rating === 'all' ||
      (place.averageRating && place.averageRating >= parseFloat(appliedFilters.rating));
    
    // Uzaklık filtresi
    const matchesDistance = appliedFilters.distance === 'all' || (() => {
      if (!currentLocation?.latitude || !currentLocation?.longitude || !place.latitude || !place.longitude) {
        return true; 
      }
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        place.latitude,
        place.longitude
      );
      return distance <= parseInt(appliedFilters.distance) / 1000; 
    })();

    // Açık mekanlar filtresi
    const matchesOpenNow = !appliedFilters.openNow || (() => {
      if (!place.workingHours) return true;
      const now = new Date();
      const currentDay = now.getDay(); 
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const todaySchedule = place.workingHours[dayNames[currentDay]];
      
      if (!todaySchedule || todaySchedule.isClosed) return false;
      
      const [openHour, openMin] = todaySchedule.open.split(':').map(Number);
      const [closeHour, closeMin] = todaySchedule.close.split(':').map(Number);
      const openTime = openHour * 60 + openMin;
      const closeTime = closeHour * 60 + closeMin;
      
      return currentTime >= openTime && currentTime <= closeTime;
    })();

    return matchesSearch && matchesCategory && matchesRating && matchesDistance && matchesOpenNow;
  });

  // Sayfa odaklanıldığında ve filtreler/lokasyon değiştiğinde yükle
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
      loadPlaces();
    }, [appliedFilters, currentLocation])
  );

  // Şehir değiştiğinde anında mekanları güncelle
  useEffect(() => {
    if (currentLocation) {
      loadPlaces();
    }
  }, [currentLocation?.latitude, currentLocation?.longitude]);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      if (!currentLocation?.latitude || !currentLocation?.longitude) {
        setPlaces([]);
        setLoading(false);
        return;
      }

      let result;
      const latitude = currentLocation.latitude;
      const longitude = currentLocation.longitude;
      // Önce yakındaki tüm mekanları al
      result = await placeService.getNearbyPlaces(latitude, longitude, 10000, true);
      let places = Array.isArray(result) ? result : (result?.data ? (Array.isArray(result.data) ? result.data : []) : []);

      if (appliedFilters.category !== 'all' || appliedFilters.rating !== 'all' || appliedFilters.distance !== 'all' || appliedFilters.openNow) {
        places = places.filter(place => {
          const categoryMatch = appliedFilters.category === 'all' ||
            place.placeType === appliedFilters.category.toUpperCase();
          const ratingMatch = appliedFilters.rating === 'all' ||
            (place.averageRating && place.averageRating >= parseFloat(appliedFilters.rating));
          
          // Uzaklık filtresi
          const distanceMatch = appliedFilters.distance === 'all' || (() => {
            if (!place.latitude || !place.longitude) return true;
            const distance = calculateDistance(
              latitude,
              longitude,
              place.latitude,
              place.longitude
            );
            return distance <= parseInt(appliedFilters.distance) / 1000;
          })();
          
          // Açık mekanlar filtresi
          const openNowMatch = !appliedFilters.openNow || (() => {
            if (!place.workingHours) return true;
            const now = new Date();
            const currentDay = now.getDay();
            const currentTime = now.getHours() * 60 + now.getMinutes();
            
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const todaySchedule = place.workingHours[dayNames[currentDay]];
            
            if (!todaySchedule || todaySchedule.isClosed) return false;
            
            const [openHour, openMin] = todaySchedule.open.split(':').map(Number);
            const [closeHour, closeMin] = todaySchedule.close.split(':').map(Number);
            const openTime = openHour * 60 + openMin;
            const closeTime = closeHour * 60 + closeMin;
          
            return currentTime >= openTime && currentTime <= closeTime;
          })();
          
          return categoryMatch && ratingMatch && distanceMatch && openNowMatch;
        });
      }
      const availablePlaces = places.filter(place => place && place.isAvailable !== false);

      const placesWithDistance = availablePlaces.map(place => {
        let distance;
        if (place.distance !== undefined && place.distance !== null) {
          distance = typeof place.distance === 'number' ? place.distance / 1000 : place.distance;
        } else if (place.latitude && place.longitude) {
          distance = calculateDistance(
            latitude,
            longitude,
            place.latitude,
            place.longitude
          );
        } else {
          distance = Infinity;
        }
        return {...place, calculatedDistance: distance};
      });

      // Mekanları mesafeye göre sırala
      const sortedPlaces = placesWithDistance.sort((a, b) => {
        const distanceA = a.calculatedDistance || Infinity;
        const distanceB = b.calculatedDistance || Infinity;
        return distanceA - distanceB;
      });

      setPlaces(sortedPlaces);
    } catch (error) {
      console.error('Mekanlar yüklenirken hata oluştu:', error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favorites = await userService.getFavorites();
      setFavoritesList(favorites || []);
    } catch (error) {
      setFavoritesList([]);
    }
  };

  const handleSearchChange = useCallback((text) => {
    setSearchText(text);
  }, []);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
  }, []);

  const handleRestaurantPress = (place) => {
    navigation.navigate('RestaurantDetail', { restaurant: place });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <View style={styles.locationContainer}>
            <Text style={[styles.locationLabel, { color: theme.colors.textSecondary }]}>Konum</Text>
            <View style={styles.locationTextContainer}>
              <FontAwesome name="map-marker" size={14} color="#667eea" />
              <Text style={[styles.locationText, { color: theme.colors.text }]}> {getLocationText()}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Restoran Listesi */}
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RestaurantCard
            item={item}
            onPress={handleRestaurantPress}
            favoritesList={favoritesList}
            onFavoriteChange={loadFavorites}
            onShowToast={showToast}
            userLocation={currentLocation}
            styles={styles} />
        )}
        ListHeaderComponent={
          <SearchHeader
            searchText={searchText}
            onSearchChange={handleSearchChange}
            onFilterPress={() => setShowFilterModal(true)}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            styles={styles} />
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#667eea" />
              <Text style={{ marginTop: 10, color: '#666' }}>Mekanlar yükleniyor...</Text>
            </View>
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#666' }}>Mekan bulunamadı</Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        removeClippedSubviews={false}
        windowSize={21}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={100}
        initialNumToRender={20}
        getItemLayout={undefined} />

      {/* Filtre Modalı */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={(filters) => {
          setAppliedFilters(filters);
          setShowFilterModal(false);
        }}
      />

      {/* Toast */}
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
