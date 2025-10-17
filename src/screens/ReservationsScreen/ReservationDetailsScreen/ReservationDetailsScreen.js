import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { styles } from './styles';

export default function ReservationDetailsScreen({ route, navigation }) {
  const { restaurant, reservation } = route.params || {};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Rezervasyon Detayı</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

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
    </View>
  );
}
