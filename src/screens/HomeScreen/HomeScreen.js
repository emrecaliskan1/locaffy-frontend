import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
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
    features: {}
  });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
  };

  // Restoranları arama metni ve filtrelere göre filtrele
  const filteredRestaurants = places.filter(place => {
    // isAvailable kontrolü - sadece aktif mekanları göster
    if (place.isAvailable === false) return false;
    
    const matchesSearch = place.name?.toLowerCase().includes(searchText.toLowerCase()) || false;
    const matchesCategory = appliedFilters.category === 'all' || 
                           place.placeType?.toLowerCase() === appliedFilters.category.toLowerCase() ||
                           place.placeType === appliedFilters.category.toUpperCase();
    const matchesRating = appliedFilters.rating === 'all' || 
                         (place.averageRating && place.averageRating >= parseFloat(appliedFilters.rating));
    
    return matchesSearch && matchesCategory && matchesRating;
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
      
      // Şehir seçimi yapılmamışsa mekan yükleme
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
      
      // Güvenli array kontrolü - result null, undefined veya array değilse boş array kullan
      let places = Array.isArray(result) ? result : (result?.data ? (Array.isArray(result.data) ? result.data : []) : []);
      
      // Frontend'de filtreleme uygula
      if (appliedFilters.category !== 'all' || appliedFilters.rating !== 'all') {
        places = places.filter(place => {
          const categoryMatch = appliedFilters.category === 'all' || 
                               place.placeType === appliedFilters.category.toUpperCase();
          const ratingMatch = appliedFilters.rating === 'all' || 
                             (place.averageRating && place.averageRating >= parseFloat(appliedFilters.rating));
          return categoryMatch && ratingMatch;
        });
      }
      
      // Ek güvenlik için frontend'de de isAvailable kontrolü yap
      const availablePlaces = places.filter(place => place && place.isAvailable !== false);
      setPlaces(availablePlaces);
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
      console.log('Favoriler yüklenirken hata:', error);
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
