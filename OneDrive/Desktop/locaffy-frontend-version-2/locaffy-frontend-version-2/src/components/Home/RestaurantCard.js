import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

export const RestaurantCard = ({ item, onPress, styles }) => (
  <TouchableOpacity 
    style={styles.restaurantCard}
    onPress={() => onPress(item)}
  >
    <View style={styles.cardImageContainer}>
      <Image source={item.image} style={styles.cardImage} />
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