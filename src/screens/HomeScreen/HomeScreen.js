import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import { useState, useCallback } from 'react';
import FilterModal from '../../components/FilterModal';
import { RestaurantCard, SearchHeader } from '../../components/Home';
import { restaurants } from '../../static-data';
import { styles } from './styles';

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    category: 'all',
    distance: '5',
    priceRange: 'all',
    rating: 'all',
    features: {}
  });

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = appliedFilters.category === 'all' || restaurant.category === appliedFilters.category;
    return matchesSearch && matchesCategory;
  });

  const handleSearchChange = useCallback((text) => {
    setSearchText(text);
  }, []);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
  }, []);

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Konum</Text>
          <Text style={styles.locationText}>📍 Merkez, Edirne</Text>
        </View>
      </View>

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
