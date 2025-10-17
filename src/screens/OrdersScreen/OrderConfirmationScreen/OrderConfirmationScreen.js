import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { styles } from './styles';

export default function OrderConfirmationScreen({ route, navigation }) {
  const { cart, restaurant, total } = route.params || {};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <Text style={styles.title}>Sipariş Onayı</Text>
        </View>
      </SafeAreaView>
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
    </View>
  );
}
