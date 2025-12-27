import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const EmptyState = ({ activeTab, styles, navigation }) => {
  const { theme } = useTheme();

  const handleMakeReservation = () => {
    navigation.navigate('Home');
  };
  
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
      
      {activeTab === 'active' && (
        <TouchableOpacity
          style={[
            localStyles.reservationButton,
            { backgroundColor: theme.colors.primary }
          ]}
          onPress={handleMakeReservation}
          activeOpacity={0.8}
        >
          <FontAwesome name="map-marker" size={18} color="#FFFFFF" style={localStyles.buttonIcon} />
          <Text style={localStyles.buttonText}>Hemen Rezervasyon Yap</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  reservationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    marginTop: 24,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default EmptyState;