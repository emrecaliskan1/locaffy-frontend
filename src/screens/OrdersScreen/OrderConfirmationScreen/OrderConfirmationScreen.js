import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import { styles } from './styles';

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
