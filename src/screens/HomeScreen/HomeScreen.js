import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import { useState } from 'react';
import FilterModal from '../../components/FilterModal';
import { restaurants } from '../../static-data';
import { styles } from './styles';

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
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

  const renderRestaurantCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
    >
      <View style={styles.cardImageContainer}>
        <Image source={item.image} style={styles.cardImage} />
        <TouchableOpacity style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>{item.isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.isOpen ? 'Açık' : 'Kapalı'}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingIcon}>⭐</Text>
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews})</Text>
          </View>
        </View>
        
        <Text style={styles.restaurantType}>{item.type}</Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{item.distance}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>⏰</Text>
            <Text style={styles.infoText}>{item.deliveryTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSearchHeader = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Mekan veya dilediğin yemeği ara..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#95A5A6"
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterIcon}>☰</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Konum</Text>
          <Text style={styles.locationText}>📍 Merkez, Edirne</Text>
        </View>
      </View>

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRestaurantCard}
        ListHeaderComponent={renderSearchHeader}
        stickyHeaderIndices={[]}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={(filters) => {
          setAppliedFilters(filters);
          setShowFilterModal(false);
        }}
      />
    </SafeAreaView>
  );
}
