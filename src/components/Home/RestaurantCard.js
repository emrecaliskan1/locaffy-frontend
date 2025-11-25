import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export const RestaurantCard = ({ item, onPress, styles }) => (

  <TouchableOpacity 
    style={styles.restaurantCard}
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
    
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={12} color="#FFD700" style={styles.ratingIcon} />
          <Text style={styles.rating}>{item.averageRating || '0.0'}</Text>
          <Text style={styles.reviews}>({item.totalRatings || 0})</Text>
        </View>
      </View>
      
      <Text style={styles.restaurantType}>{item.placeType}</Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.infoItem}>
          <FontAwesome name="map-marker" size={12} color="#95A5A6" style={styles.infoIcon} />
          <Text style={styles.infoText}>{item.distance ? `${(item.distance / 1000).toFixed(1)} km` : item.address}</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome name="clock-o" size={12} color="#95A5A6" style={styles.infoIcon} />
          <Text style={styles.infoText}>{item.openingHours}</Text>
        </View>
      </View>
      
    </View>
  </TouchableOpacity>
);