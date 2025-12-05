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
import { styles } from './styles';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
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
    return matchesSearch && matchesCategory;
  });

  // Filtreler değiştiğinde mekanları yeniden yükle
  useEffect(() => {
    loadPlaces();
  }, [appliedFilters]);

  // Sayfa odaklanıldığında favorileri ve mekanları yükle
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
      loadPlaces(); 
    }, [appliedFilters]) 
  );

  const loadPlaces = async () => {
    try {
      setLoading(true);
      let result;
      if (appliedFilters.category !== 'all' || appliedFilters.rating !== 'all') {
        const minRating = appliedFilters.rating !== 'all' ? parseFloat(appliedFilters.rating) : undefined;
        const placeType = appliedFilters.category !== 'all' ? appliedFilters.category.toUpperCase() : undefined;
        result = await placeService.getFilteredPlaces(placeType, minRating, true);
      } else {
        // Varsayılan Edirne koordinatlarını kullan
        result = await placeService.getNearbyPlaces(41.6771, 26.5557, 10000, true);
      }
      
      // Güvenli array kontrolü - result null, undefined veya array değilse boş array kullan
      const places = Array.isArray(result) ? result : (result?.data ? (Array.isArray(result.data) ? result.data : []) : []);
      
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
              <Text style={[styles.locationText, { color: theme.colors.text }]}> Merkez, Edirne</Text>
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
        removeClippedSubviews={true}
        windowSize={10}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        initialNumToRender={8} />

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
