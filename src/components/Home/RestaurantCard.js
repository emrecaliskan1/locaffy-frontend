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
    onPress={() => onPress(item)}
  >
    <View style={styles.cardImageContainer}>
      <Image source={item.image} style={styles.cardImage} />
      <TouchableOpacity style={styles.favoriteButton}>
        <FontAwesome name={item.isFavorite ? "heart" : "heart-o"} size={16} color={item.isFavorite ? "#E74C3C" : "#95A5A6"} style={styles.favoriteIcon} />
      </TouchableOpacity>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{item.isOpen ? 'Açık' : 'Kapalı'}</Text>
      </View>
    </View>
    
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={12} color="#FFD700" style={styles.ratingIcon} />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>({item.reviews})</Text>
        </View>
      </View>
      
      <Text style={styles.restaurantType}>{item.type}</Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.infoItem}>
          <FontAwesome name="map-marker" size={12} color="#95A5A6" style={styles.infoIcon} />
          <Text style={styles.infoText}>{item.distance}</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome name="clock-o" size={12} color="#95A5A6" style={styles.infoIcon} />
          <Text style={styles.infoText}>{item.deliveryTime}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);