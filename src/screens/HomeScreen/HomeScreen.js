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
import { useState, useCallback, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import FilterModal from '../../components/FilterModal';
import { RestaurantCard, SearchHeader } from '../../components/Home';
import { placeService } from '../../services';
import { styles } from './styles';

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState({
    category: 'all',
    distance: '5',
    priceRange: 'all',
    rating: 'all',
    features: {}
  });

  const filteredRestaurants = places.filter(place => {
    const matchesSearch = place.name?.toLowerCase().includes(searchText.toLowerCase()) || false;
    const matchesCategory = appliedFilters.category === 'all' || 
                           place.placeType?.toLowerCase() === appliedFilters.category.toLowerCase() ||
                           place.placeType === appliedFilters.category.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    loadPlaces();
  }, [appliedFilters]);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      let result;
      
      if (appliedFilters.category !== 'all' || appliedFilters.rating !== 'all') {
        const minRating = appliedFilters.rating !== 'all' ? parseFloat(appliedFilters.rating) : undefined;
        const placeType = appliedFilters.category !== 'all' ? appliedFilters.category.toUpperCase() : undefined;
        result = await placeService.getFilteredPlaces(placeType, minRating);
      } else {
        // Use default Edirne coordinates
        result = await placeService.getNearbyPlaces(41.6771, 26.5557, 10000);
      }
      
      setPlaces(result || []);
    } catch (error) {
      console.error('Error loading places:', error);
      setPlaces([]);
    } finally {
      setLoading(false);
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>Konum</Text>
            <View style={styles.locationTextContainer}>
              <FontAwesome name="map-marker" size={14} color="#667eea" />
              <Text style={styles.locationText}> Merkez, Edirne</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RestaurantCard 
            item={item} 
            onPress={handleRestaurantPress}
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

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={(filters) => {
          setAppliedFilters(filters);
          setShowFilterModal(false);
        }}
      />
    </View>
  );
}
