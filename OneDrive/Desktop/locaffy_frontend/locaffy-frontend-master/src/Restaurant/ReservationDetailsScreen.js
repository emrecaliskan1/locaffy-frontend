import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';

export default function ReservationDetailsScreen({ route, navigation }) {
  const { restaurant, reservation } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Rezervasyon Detayı</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.restaurantName}>{restaurant?.name || 'Restoran'}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Tarih:</Text>
          <Text style={styles.value}>{reservation?.date || '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Saat:</Text>
          <Text style={styles.value}>{reservation?.time || '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Kişi:</Text>
          <Text style={styles.value}>{reservation?.people || '-'}</Text>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.navigate('Reservations')}>
          <Text style={styles.confirmText}>Onayla ve Rezervasyonlarım'a Git</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5DC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFFFFF' },
  backButton: { padding: 8 },
  backIcon: { fontSize: 22, color: '#2C3E50' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50' },
  content: { padding: 20 },
  restaurantName: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { color: '#7F8C8D' },
  value: { fontWeight: '600', color: '#2C3E50' },
  confirmButton: { marginTop: 30, backgroundColor: '#FF6B35', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  confirmText: { color: '#FFFFFF', fontWeight: 'bold' }
});
