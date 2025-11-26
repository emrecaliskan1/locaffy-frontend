import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const EmptyState = ({ activeTab, styles }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.emptyContainer}>
      <FontAwesome name="calendar" size={50} color={theme.colors.textSecondary} style={styles.emptyIcon} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        {activeTab === 'active' ? 'Aktif rezervasyonunuz yok' : 'Geçmiş rezervasyonunuz yok'}
      </Text>
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        {activeTab === 'active' 
          ? 'Henüz aktif bir rezervasyonunuz bulunmuyor' 
          : 'Daha önce yaptığınız rezervasyonlar burada görünecek'
        }
      </Text>
    </View>
  );
};

export default EmptyState;