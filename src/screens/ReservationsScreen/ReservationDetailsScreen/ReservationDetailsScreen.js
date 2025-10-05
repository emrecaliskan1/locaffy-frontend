import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import { styles } from './styles';

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
