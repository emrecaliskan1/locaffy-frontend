import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export const InfoTab = ({ restaurant, styles }) => (
  <View style={styles.tabContent}>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Restoran Bilgileri</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>📍</Text>
        <Text style={styles.infoText}>{restaurant.address}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>📞</Text>
        <Text style={styles.infoText}>{restaurant.phone}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>⏰</Text>
        <Text style={styles.infoText}>{restaurant.workingHours}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>📝</Text>
        <Text style={styles.infoText}>{restaurant.description}</Text>
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>✨ Özellikler</Text>
        <View style={styles.featuresContainer}>
          {restaurant.features?.map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.webMapPlaceholder}>
        <Text style={styles.webMapTitle}>📍 Konum</Text>
        <Text style={styles.webMapText}>{restaurant.name}</Text>
        <Text style={styles.webMapAddress}>{restaurant.address}</Text>
        <TouchableOpacity style={styles.webMapButton}>
          <Text style={styles.webMapButtonText}>Haritada Gör</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);