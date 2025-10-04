import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';

export default function OrderConfirmationScreen({ route, navigation }) {
  const { cart, restaurant, total } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sipariş Onayı</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.thanks}>Teşekkürler!</Text>
        <Text style={styles.info}>Siparişiniz alınmıştır. Restorana bildirim gönderildi.</Text>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Restoran: {restaurant?.name}</Text>
          <Text style={styles.summaryText}>Kalemler: {cart?.length || 0}</Text>
          <Text style={styles.summaryText}>Toplam: ₺{(total || 0).toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.doneButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.doneText}>Ana Sayfaya Dön</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5DC' },
  header: { padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: '#2C3E50' },
  content: { padding: 20, alignItems: 'center' },
  thanks: { fontSize: 24, fontWeight: '800', color: '#2C3E50', marginBottom: 10 },
  info: { color: '#7F8C8D', textAlign: 'center', marginBottom: 20 },
  summary: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, width: '100%', marginBottom: 20 },
  summaryText: { fontSize: 16, color: '#2C3E50', marginBottom: 6 },
  doneButton: { backgroundColor: '#FF6B35', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  doneText: { color: '#FFFFFF', fontWeight: '700' }
});
