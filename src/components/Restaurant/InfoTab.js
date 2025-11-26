import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export const InfoTab = ({ restaurant, styles }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.tabContent, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Restoran Bilgileri</Text>
        
        <View style={[styles.infoRow, { backgroundColor: theme.colors.background }]}>
          <FontAwesome name="map-marker" size={16} color="#27AE60" style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{restaurant.address || 'Adres bilgisi bulunmuyor'}</Text>
        </View>
        
        <View style={[styles.infoRow, { backgroundColor: theme.colors.background }]}>
          <FontAwesome name="phone" size={16} color="#3498DB" style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{restaurant.phoneNumber || 'Telefon bilgisi bulunmuyor'}</Text>
        </View>
        
        <View style={[styles.infoRow, { backgroundColor: theme.colors.background }]}>
          <FontAwesome name="clock-o" size={16} color="#E67E22" style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{restaurant.openingHours || 'Çalışma saatleri belirtilmemiş'}</Text>
        </View>

        <View style={[styles.infoRow, { backgroundColor: theme.colors.background }]}>
          <FontAwesome name="file-text-o" size={16} color="#9B59B6" style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{restaurant.description || 'Açıklama bulunmuyor'}</Text>
        </View>

        <View style={[styles.infoRow, { backgroundColor: theme.colors.background }]}>
          <FontAwesome name="star" size={16} color="#F1C40F" style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Ortalama Puan: {restaurant.rating ? restaurant.rating.toFixed(1) : 0}/5 
            ({restaurant.reviewCount || 0} {restaurant.reviewCount === 0 ? 'değerlendirme yok' : 'değerlendirme'})
          </Text>
        </View>

        <View style={[styles.webMapPlaceholder, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <FontAwesome name="map-marker" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.webMapTitle, { color: theme.colors.text }]}>Konum</Text>
          </View>
          <Text style={[styles.webMapText, { color: theme.colors.text }]}>{restaurant.name}</Text>
          <Text style={[styles.webMapAddress, { color: theme.colors.textSecondary }]}>{restaurant.address || 'Adres bilgisi bulunmuyor'}</Text>
          <TouchableOpacity style={[styles.webMapButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.webMapButtonText, { color: '#FFFFFF' }]}>Haritada Gör</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};