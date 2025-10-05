import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import { useState } from 'react';
import FilterModal from '../Home/FilterModal';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('Hepsi');
  const [viewMode, setViewMode] = useState('list');
  const [searchText, setSearchText] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const categories = [
    { id: 'all', name: 'Hepsi', icon: '🍽️' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'burger', name: 'Burger', icon: '🍔' },
    { id: 'sushi', name: 'Sushi', icon: '🍣' },
    { id: 'kebab', name: 'Kebap', icon: '🥙' },
    { id: 'dessert', name: 'Tatlı', icon: '🍰' },
  ];

  const restaurants = [
    {
      id: 1,
      name: 'Günaydın Steakhouse',
      type: 'Et Restoranı',
      rating: 4.8,
      reviews: 342,
      distance: '0.5 km',
      deliveryTime: '25-35 dk',
      image: require('../../assets/steakhouse.jpeg'),
      discount: '20% indirim',
      isOpen: true,
      isFavorite: false,
      category: 'burger',
      isSelfService: false
    },
    {
      id: 2,
      name: 'Pizza Palace',
      type: 'İtalyan',
      rating: 4.6,
      reviews: 128,
      distance: '0.8 km',
      deliveryTime: '20-30 dk',
      image: require('../../assets/pizza.jpeg'),
      discount: '15% indirim',
      isOpen: true,
      isFavorite: true,
      category: 'pizza',
      isSelfService: true
    },
    {
      id: 3,
      name: 'Sushi Master',
      type: 'Japon',
      rating: 4.9,
      reviews: 89,
      distance: '1.2 km',
      deliveryTime: '30-40 dk',
      image: require('../../assets/sushi.jpeg'),
      discount: null,
      isOpen: false,
      isFavorite: false,
      category: 'sushi',
      isSelfService: false
    },
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCategory = activeCategory === 'Hepsi' || restaurant.category === activeCategory.toLowerCase();
    const matchesSearch = restaurant.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderRestaurantCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
    >
      <View style={styles.cardImageContainer}>
        <Image source={item.image} style={styles.cardImage} />
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
        )}
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

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        activeCategory === item.name && styles.activeCategoryButton
      ]}
      onPress={() => setActiveCategory(item.name)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryText,
        activeCategory === item.name && styles.activeCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Konum</Text>
          <Text style={styles.locationText}>📍 Beşiktaş, İstanbul</Text>
        </View>
        
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Restoran veya yemek ara..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Text style={styles.filterIcon}>🔽</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggleContainer}>
        <TouchableOpacity
          style={[styles.viewButton, viewMode === 'list' && styles.activeViewButton]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.viewButtonText, viewMode === 'list' && styles.activeViewButtonText]}>
            Liste
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, viewMode === 'map' && styles.activeViewButton]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.viewButtonText, viewMode === 'map' && styles.activeViewButtonText]}>
            Harita
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              activeCategory === category.name && styles.activeCategoryButton
            ]}
            onPress={() => setActiveCategory(category.name)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryText,
              activeCategory === category.name && styles.activeCategoryText
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Restaurant List */}
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRestaurantCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={(filters) => {
          // Filter logic here
          setShowFilterModal(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#2C3E50',
  },
  locationContainer: {
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  profileButton: {
    padding: 8,
  },
  profileIcon: {
    fontSize: 24,
    color: '#2C3E50',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 20,
    color: '#7F8C8D',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  filterButton: {
    padding: 5,
  },
  filterIcon: {
    fontSize: 20,
    color: '#7F8C8D',
  },
  viewToggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 4,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeViewButton: {
    backgroundColor: '#FF6B35',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  activeViewButtonText: {
    color: '#FFFFFF',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    minWidth: 80,
  },
  activeCategoryButton: {
    backgroundColor: '#FF6B35',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardImageContainer: {
    position: 'relative',
    height: 180,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#27AE60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  restaurantType: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});
