import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { restaurants } from '../../static-data/restaurants';

export default function FavoriteRestaurantsScreen({ navigation }) {
  // Favori restoranlar - isFavorite: true olanları filtrele
  const favoriteRestaurants = restaurants.filter(restaurant => restaurant.isFavorite);

  const handleRestaurantPress = (restaurant) => {
    // Restoran detay sayfasına git
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  const handleRemoveFavorite = (id) => {
    // Favorilerden çıkarma işlemi
    console.log('Remove favorite:', id);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favori Restoranlar</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          {favoriteRestaurants.length} favori restoran
        </Text>

        {favoriteRestaurants.map((restaurant) => (
          <TouchableOpacity
            key={restaurant.id}
            style={styles.restaurantCard}
            onPress={() => handleRestaurantPress(restaurant)}
            activeOpacity={0.9}
          >
            <Image
              source={restaurant.image}
              style={styles.restaurantImage}
              resizeMode="cover"
            />
            <View style={styles.restaurantInfo}>
              <View style={styles.restaurantHeader}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => handleRemoveFavorite(restaurant.id)}
                >
                  <FontAwesome name="heart" size={20} color="#E74C3C" />
                </TouchableOpacity>
              </View>
              <Text style={styles.restaurantCuisine}>{restaurant.type}</Text>
              <View style={styles.restaurantFooter}>
                <View style={styles.ratingContainer}>
                  <FontAwesome name="star" size={14} color="#F39C12" />
                  <Text style={styles.ratingText}>{restaurant.rating > 0 ? restaurant.rating : 'Yeni'}</Text>
                </View>
                <View style={styles.distanceContainer}>
                  <FontAwesome name="map-marker" size={14} color="#95A5A6" />
                  <Text style={styles.distanceText}>{restaurant.distance || 'Yakınınızda'}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 16,
    marginBottom: 16,
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  restaurantImage: {
    width: '100%',
    height: 180,
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  restaurantName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  restaurantFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    marginLeft: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 4,
  },
});
