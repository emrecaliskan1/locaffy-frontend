import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { userService } from '../../services';
import { useTheme } from '../../context/ThemeContext';

export default function FavoriteRestaurantsScreen({ navigation }) {
  const { theme } = useTheme();
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    //Favorilere ekleme kısmı henüz yok gelecek.
    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  const handleRemoveFavorite = async (placeId) => {
    try {
      await userService.removeFromFavorites(placeId);
      // Favorilerden çıkarıldıktan sonra listeyi güncelle
      setFavoriteRestaurants(prev => prev.filter(restaurant => restaurant.id !== placeId));
      Alert.alert('Başarılı', 'Restoran favorilerden çıkarıldı');
    } catch (error) {
      console.log('Error removing favorite:', error);
      Alert.alert('Hata', 'Favorilerden çıkarılırken bir hata oluştu');
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
            <Image
              source={restaurant.image}
              style={styles.restaurantImage}
              resizeMode="cover"
            />
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
                  <FontAwesome name="star" size={14} color="#F39C12" />
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
