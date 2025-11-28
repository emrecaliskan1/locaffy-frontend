import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { userService } from '../../services';

export const RestaurantCard = ({ item, onPress, favoritesList = [], onFavoriteChange, onShowToast, styles }) => {
  const { theme } = useTheme();
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  
  const isFavorite = favoritesList.some(fav => fav.id === item.id);

  // Favori toggle fonksiyonu
  const handleFavoriteToggle = async (e) => {
    e.stopPropagation(); 
    
    if (favoriteLoading) return;
    
    try {
      setFavoriteLoading(true);
      
      if (isFavorite) {
        await userService.removeFromFavorites(item.id);
        if (onShowToast) {
          onShowToast('Restoran favorilerden çıkarıldı', 'success');
        }
      } else {
        await userService.addToFavorites(item.id);
        if (onShowToast) {
          onShowToast('Restoran favorilere eklendi', 'success');
        }
      }
      
      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      console.log('Error toggling favorite:', error);
      if (onShowToast) {
        onShowToast(error.message || 'Favori işlemi gerçekleştirilemedi', 'error');
      }
    } finally {
      setFavoriteLoading(false);
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.restaurantCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={() => onPress(item)}>

      <View style={styles.cardImageContainer}>
        <Image 
          source={item.mainImageUrl ? { uri: item.mainImageUrl } : require('../../../assets/icon.png')} 
          style={styles.cardImage} 
        />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavoriteToggle}
          disabled={favoriteLoading}
        >
          {favoriteLoading ? (
            <ActivityIndicator size="small" color="#E74C3C" />
          ) : (
            <FontAwesome 
              name={isFavorite ? "heart" : "heart-o"} 
              size={16} 
              color={isFavorite ? "#E74C3C" : "#95A5A6"} 
              style={styles.favoriteIcon} 
            />
          )}
        </TouchableOpacity>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.active ? 'Açık' : 'Kapalı'}</Text>
        </View>
      </View>
      
      {/*Kartların Üzerindeki Mekan Bilgileri */}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.restaurantName, { color: theme.colors.text }]}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={12} color="#FFD700" style={styles.ratingIcon} />
            <Text style={[styles.rating, { color: theme.colors.text }]}>{item.averageRating ? item.averageRating.toFixed(1) : '0.0'}</Text>
            <Text style={[styles.reviews, { color: theme.colors.textSecondary }]}>({item.totalRatings || 0})</Text>
          </View>
        </View>
        
        <Text style={[styles.restaurantType, { color: theme.colors.textSecondary }]}>{item.placeType}</Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.infoItem}>
            <FontAwesome name="map-marker" size={12} color="#95A5A6" style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: theme.colors.textTertiary }]}>{item.address}</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="clock-o" size={12} color="#95A5A6" style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: theme.colors.textTertiary }]}>{item.openingHours}</Text>
          </View>
        </View>
        
      </View>
    </TouchableOpacity>
  );
};