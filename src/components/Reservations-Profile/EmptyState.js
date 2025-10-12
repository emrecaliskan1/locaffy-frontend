import React from 'react';
import { View, Text } from 'react-native';

const EmptyState = ({ activeTab, styles }) => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={styles.emptyTitle}>
        {activeTab === 'active' ? 'Aktif rezervasyonunuz yok' : 'Geçmiş rezervasyonunuz yok'}
      </Text>
      <Text style={styles.emptyText}>
        {activeTab === 'active' 
          ? 'Henüz aktif bir rezervasyonunuz bulunmuyor' 
          : 'Daha önce yaptığınız rezervasyonlar burada görünecek'
        }
      </Text>
    </View>
  );
};

export default EmptyState;