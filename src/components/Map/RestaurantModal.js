import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';

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
              <Text style={styles.modalIconEmoji}>🍽️</Text>
            </View>
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBody}>
            <Text style={styles.modalRestaurantName}>{restaurant.name}</Text>
            <Text style={styles.modalRestaurantType}>{restaurant.type}</Text>
            
            <View style={styles.modalInfoRow}>
              <Text style={styles.modalRating}>⭐ {restaurant.rating}</Text>
              <Text style={styles.modalDistance}>{restaurant.distance}</Text>
            </View>
            
            <Text style={styles.modalAddress}>📍 {restaurant.address}</Text>
            
            {restaurant.priceRange && (
              <Text style={styles.modalPrice}>💰 {restaurant.priceRange}</Text>
            )}
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