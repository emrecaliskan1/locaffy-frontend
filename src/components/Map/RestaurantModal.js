import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getRestaurantIconComponent } from '../../utils/restaurantIcons';

export const RestaurantModal = ({ visible, restaurant, onClose, onViewDetails, styles }) => {
  if (!restaurant) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalRestaurantIcon}>
              <View style={styles.modalIconEmoji}>
                {getRestaurantIconComponent(restaurant.placeType, 24, '#FFFFFF')}
              </View>
            </View>
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
              <FontAwesome name="times" size={18} color="#95A5A6" style={styles.modalCloseText} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            <Text style={styles.modalRestaurantName}>{restaurant.name}</Text>
            <Text style={styles.modalRestaurantType}>{restaurant.placeType}</Text>
            
            <View style={styles.modalInfoRow}>
              <View style={styles.modalRatingContainer}>
                <FontAwesome name="star" size={14} color="#FFD700" />
                <Text style={styles.modalRating}>{restaurant.averageRating || '0.0'}</Text>
              </View>
              <Text style={styles.modalDistance}>{restaurant.distance ? `${(restaurant.distance / 1000).toFixed(1)} km` : 'Yakın'}</Text>
            </View>
            
            <View style={styles.modalLocationRow}>
              <FontAwesome name="map-marker" size={14} color="#E74C3C" />
              <Text style={styles.modalAddress}>{restaurant.address}</Text>
            </View>
            
            <View style={styles.modalPriceRow}>
              <FontAwesome name="clock-o" size={14} color="#27AE60" />
              <Text style={styles.modalPrice}>{restaurant.openingHours}</Text>
            </View>
          </View>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalDetailButton}
              onPress={() => {
                onClose();
                onViewDetails(restaurant);
              }}
            >
              <Text style={styles.modalDetailButtonText}>Detay Gör</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};