import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { userService } from '../../services';
import { useTheme } from '../../context/ThemeContext';
import Toast from '../../components/Toast';
import { RestaurantCard } from '../../components/Home';

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
      setFavoriteRestaurants(favorites || []);
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

  const handleFavoriteChange = () => {
    // Favoriler değiştiğinde listeyi yeniden yükle
    loadFavorites();
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
                <View key={restaurant.id} style={styles.cardWrapper}>
                  <RestaurantCard
                    item={restaurant}
                    onPress={handleRestaurantPress}
                    favoritesList={favoriteRestaurants}
                    onFavoriteChange={handleFavoriteChange}
                    onShowToast={showToast}
                    styles={cardStyles}
                  />
                </View>
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
  cardWrapper: {
    marginVertical: 8,
  },
});

// RestaurantCard için stil
const cardStyles = StyleSheet.create({
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
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
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    textAlign: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  restaurantName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginRight: 2,
  },
  reviews: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  restaurantType: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  cardFooter: {
    gap: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#95A5A6',
    flex: 1,
  },
});
