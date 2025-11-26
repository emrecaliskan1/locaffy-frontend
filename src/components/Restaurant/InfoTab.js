import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const InfoTab = ({ restaurant, styles }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.tabContent, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Restoran Bilgileri</Text>
        
        <View style={[styles.infoRow, { backgroundColor: theme.colors.background }]}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{restaurant.address || 'Adres bilgisi bulunmuyor'}</Text>
        </View>
        
        <View style={[styles.infoRow, { backgroundColor: theme.colors.background }]}>
          <Text style={styles.infoIcon}>📞</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{restaurant.phoneNumber || 'Telefon bilgisi bulunmuyor'}</Text>
        </View>
        
        <View style={[styles.infoRow, { backgroundColor: theme.colors.background }]}>
          <Text style={styles.infoIcon}>⏰</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{restaurant.openingHours || 'Çalışma saatleri belirtilmemiş'}</Text>
        </View>

        <View style={[styles.infoRow, { backgroundColor: theme.colors.background }]}>
          <Text style={styles.infoIcon}>📝</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{restaurant.description || 'Açıklama bulunmuyor'}</Text>
        </View>

        <View style={[styles.infoRow, { backgroundColor: theme.colors.background }]}>
          <Text style={styles.infoIcon}>⭐</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Ortalama Puan: {restaurant.rating ? restaurant.rating.toFixed(1) : 0}/5 
            ({restaurant.reviewCount || 0} {restaurant.reviewCount === 0 ? 'değerlendirme yok' : 'değerlendirme'})
          </Text>
        </View>

        <View style={[styles.webMapPlaceholder, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.webMapTitle, { color: theme.colors.text }]}>📍 Konum</Text>
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