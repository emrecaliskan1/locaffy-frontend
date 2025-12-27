import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useLocation } from '../../../context/LocationContext';
import Toast from '../../../components/Toast';
import { RestaurantCard } from '../../../components/Home/RestaurantCard';
import { styles } from './styles';
import { styles as homeStyles } from '../../HomeScreen/styles';
import { useToast, useFavorites } from '../../../hooks';

export default function FavoriteRestaurantsScreen({ navigation }) {
  const { theme } = useTheme();
  const { currentLocation } = useLocation();
  const { toast, showToast, hideToast } = useToast();
  const { favorites: favoriteRestaurants, loading, loadFavorites } = useFavorites();

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
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
        <View style={[styles.header, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Favori Mekanlar</Text>
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Favori mekanlarınız yükleniyor...</Text>
          </View>
        ) : (
          <>
            {favoriteRestaurants.length === 0 ? (
              <View style={styles.emptyState}>
                <FontAwesome name="heart-o" size={50} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>Henüz favori restoranınız yok</Text>
                <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>Beğendiğiniz restoranları favorilerinize ekleyin</Text>
                <TouchableOpacity
                  style={[styles.exploreButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => navigation.navigate('Home')}
                  activeOpacity={0.8}
                >
                  <FontAwesome name="map-marker" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Mekanları Keşfet</Text>
                </TouchableOpacity>
              </View>
            ) : (
              favoriteRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  item={restaurant}
                  onPress={handleRestaurantPress}
                  favoritesList={favoriteRestaurants}
                  onFavoriteChange={handleFavoriteChange}
                  onShowToast={showToast}
                  userLocation={currentLocation}
                  styles={homeStyles}
                />
              ))
            )}
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

