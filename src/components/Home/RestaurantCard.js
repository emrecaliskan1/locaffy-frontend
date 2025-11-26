import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export const RestaurantCard = ({ item, onPress, styles }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.restaurantCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={() => onPress(item)}>

      <View style={styles.cardImageContainer}>
        <Image 
          source={item.mainImageUrl ? { uri: item.mainImageUrl } : require('../../../assets/icon.png')} 
          style={styles.cardImage} 
        />
        <TouchableOpacity style={styles.favoriteButton}>
          <FontAwesome name="heart-o" size={16} color="#95A5A6" style={styles.favoriteIcon} />
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