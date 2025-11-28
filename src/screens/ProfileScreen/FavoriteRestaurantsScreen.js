import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { userService } from '../../services';
import { useTheme } from '../../context/ThemeContext';
import Toast from '../../components/Toast';

export default function FavoriteRestaurantsScreen({ navigation }) {
  const { theme } = useTheme();
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
  };

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favorites = await userService.getFavorites();
      // Backend'den gelen PlaceResponse'ları frontend formatına dönüştür
      const formattedFavorites = favorites.map(place => ({
        id: place.id,
        name: place.name,
        address: place.address,
        category: place.placeType || 'Restoran',
        type: place.placeType || 'Restoran',
        rating: place.averageRating || 0,
        distance: place.distance ? `${(place.distance / 1000).toFixed(1)} km` : 'Yakınınızda',
        image: place.mainImageUrl ? { uri: place.mainImageUrl } : null,
        phoneNumber: place.phoneNumber,
        description: place.description,
        openingHours: place.openingHours,
        workingDays: place.workingDays,
        latitude: place.latitude,
        longitude: place.longitude,
        totalRatings: place.totalRatings
      }));
      setFavoriteRestaurants(formattedFavorites);
    } catch (error) {
      setFavoriteRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  const handleRemoveFavorite = async (placeId) => {
    try {
      await userService.removeFromFavorites(placeId);
      // Favorilerden çıkarıldıktan sonra listeyi güncelle
      setFavoriteRestaurants(prev => prev.filter(restaurant => restaurant.id !== placeId));
      showToast('Restoran favorilerden çıkarıldı', 'success');
    } catch (error) {
      console.log('Error removing favorite:', error);
      showToast('Favorilerden çıkarılırken bir hata oluştu', 'error');
    }
  };

  return (
    
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Favori Restoranlar</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Favori restoranlarınız yükleniyor...</Text>
          </View>
        ) : (
          <>
            {favoriteRestaurants.length === 0 ? (
              <View style={styles.emptyState}>
                <FontAwesome name="heart-o" size={50} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>Henüz favori restoranınız yok</Text>
                <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>Beğendiğiniz restoranları favorilerinize ekleyin</Text>
              </View>
            ) : (
              favoriteRestaurants.map((restaurant) => (
          <TouchableOpacity
            key={restaurant.id}
            style={[styles.restaurantCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => handleRestaurantPress(restaurant)}
            activeOpacity={0.9}
          >
            {restaurant.image ? (
              <Image
                source={restaurant.image}
                style={styles.restaurantImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.restaurantImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                <FontAwesome name="image" size={40} color="#ccc" />
                <Text style={{ color: '#999', fontSize: 12, marginTop: 8 }}>Resim yok</Text>
              </View>
            )}
            <View style={styles.restaurantInfo}>
              <View style={styles.restaurantHeader}>
                <Text style={[styles.restaurantName, { color: theme.colors.text }]}>{restaurant.name}</Text>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => handleRemoveFavorite(restaurant.id)}
                >
                  <FontAwesome name="heart" size={20} color="#E74C3C" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.restaurantCuisine, { color: theme.colors.textSecondary }]}>{restaurant.category || restaurant.type}</Text>
              <View style={styles.restaurantFooter}>
                <View style={styles.ratingContainer}>
                  <FontAwesome name="star" size={14} color="#F1C40F" />
                  <Text style={[styles.ratingText, { color: theme.colors.text }]}>{restaurant.rating > 0 ? restaurant.rating : 'Yeni'}</Text>
                </View>
                <View style={styles.distanceContainer}>
                  <FontAwesome name="map-marker" size={14} color={theme.colors.textSecondary} />
                  <Text style={[styles.distanceText, { color: theme.colors.textSecondary }]}>{restaurant.distance || 'Yakınınızda'}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
              ))
            )}

            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>
      
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
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
    marginTop: 20,
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
