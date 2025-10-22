import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import { styles } from './styles';
import { FontAwesome } from '@expo/vector-icons';

export default function ReservationDetailsScreen({ route, navigation }) {
  const { restaurant, reservation } = route.params || {};
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Animasyon için refs
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showSuccessModal) {
      // Modal açıldığında animasyonları başlat
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // 2.5 saniye sonra rezervasyonlar sayfasına git
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate('Reservations', { fromRestaurant: true });
      }, 2500);
    }
  }, [showSuccessModal]);

  const handleConfirm = () => {
    // TODO: Backend'e rezervasyon kaydedilecek
    // POST /api/reservations
    // Body: { restaurantId, date, time, people }
    
    console.log('Reservation confirmed:', {
      restaurant: restaurant?.name,
      date: reservation?.date,
      time: reservation?.time,
      people: reservation?.people,
    });

    setShowSuccessModal(true);
  };

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

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Onayla ve Rezervasyonlarım'a Git</Text>
        </TouchableOpacity>
      </View>

      {/* Success Animation Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[
            styles.successCard,
            { transform: [{ scale: scaleAnim }] }
          ]}>
            <Animated.View style={{
              opacity: checkmarkAnim,
              transform: [{
                rotate: checkmarkAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-45deg', '0deg']
                })
              }]
            }}>
              <FontAwesome name="check-circle" size={80} color="#27AE60" />
            </Animated.View>
            <Text style={styles.successTitle}>Rezervasyonunuz</Text>
            <Text style={styles.successTitle}>Başarıyla Oluşturuldu!</Text>
            <Text style={styles.successSubtitle}>
              {restaurant?.name}
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
