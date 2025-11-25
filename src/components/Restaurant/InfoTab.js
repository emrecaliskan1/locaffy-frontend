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
        <Text style={styles.infoText}>{restaurant.address || 'Adres bilgisi bulunmuyor'}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>📞</Text>
        <Text style={styles.infoText}>{restaurant.phoneNumber || 'Telefon bilgisi bulunmuyor'}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>⏰</Text>
        <Text style={styles.infoText}>{restaurant.openingHours || 'Çalışma saatleri belirtilmemiş'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>📝</Text>
        <Text style={styles.infoText}>{restaurant.description || 'Açıklama bulunmuyor'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>⭐</Text>
        <Text style={styles.infoText}>Ortalama Puan: {restaurant.averageRating || 0}/5 ({restaurant.totalRatings || 0} değerlendirme)</Text>
      </View>

      <View style={styles.webMapPlaceholder}>
        <Text style={styles.webMapTitle}>📍 Konum</Text>
        <Text style={styles.webMapText}>{restaurant.name}</Text>
        <Text style={styles.webMapAddress}>{restaurant.address || 'Adres bilgisi bulunmuyor'}</Text>
        <TouchableOpacity style={styles.webMapButton}>
          <Text style={styles.webMapButtonText}>Haritada Gör</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);