import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Modal,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { styles } from './styles';
import { useTheme } from '../../context/ThemeContext';

import { ReservationCard, TabButtons, EmptyState } from '../../components/Reservations-Profile';
import Toast from '../../components/Toast';
import { reservationService } from '../../services';


export default function ReservationsScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('active');
  const { fromProfile, fromRestaurant } = route.params || {};
  const { theme } = useTheme();

  const [activeReservations, setActiveReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success', duration: 3000 });

  const showToast = (message, type = 'error', duration = 3000) => {
    setToast({ visible: true, message, type, duration });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success', duration: 3000 });
  };

  const loadReservations = async () => {
    try {
      setLoading(true);
      const reservations = await reservationService.getUserReservations();
      // Rezervasyonları tarih ve durumuna göre ayır
      const now = new Date();
      const active = reservations.filter(res => {
        let resTime;
        
        if (res.reservationTime.includes('T')) {
          const [datePart, timePart] = res.reservationTime.split('T');
          const [year, month, day] = datePart.split('-');
          const [hour, minute] = timePart.split(':');
          
          resTime = new Date(year, month - 1, day, hour, minute);
        } else {
          resTime = new Date(res.reservationTime);
        }
        
        return resTime >= now && (res.status === 'APPROVED' || res.status === 'PENDING');
      });
      
      const past = reservations.filter(res => {
        let resTime;
        
        if (res.reservationTime.includes('T')) {
          const [datePart, timePart] = res.reservationTime.split('T');
          const [year, month, day] = datePart.split('-');
          const [hour, minute] = timePart.split(':');
          resTime = new Date(year, month - 1, day, hour, minute);
        } else {
          resTime = new Date(res.reservationTime);
        }
        
        return resTime < now || res.status === 'REJECTED' || res.status === 'CANCELLED' || res.status === 'NO_SHOW' || res.status === 'COMPLETED';
      });
      
      setActiveReservations(active);
      setPastReservations(past);
    } catch (error) {
      console.log('Error loading reservations:', error);
      showToast('Rezervasyonlar yüklenirken bir hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Değerlendirme sonrası güncelleme için listener
  useEffect(() => {
    loadReservations();
    
    const unsubscribe = navigation.addListener('focus', () => {
      // Ekran her açıldığında verileri yenile
      loadReservations();
    });

    return unsubscribe;
  }, [navigation]);

  const handleBackPress = () => {
    if (fromRestaurant) {
      navigation.navigate('Main', { screen: 'Home' });
    } else if (fromProfile) {
      navigation.navigate('Main', { screen: 'Profile' });
    } else {
      navigation.goBack();
    }
  };

  const handleCancelReservation = (reservation) => {
    // Client-side validasyon
    if (!reservationService.canCancelReservation(reservation)) {
      let errorMessage = '';
      
      // Statü kontrolü
      if (reservation.status !== 'PENDING' && reservation.status !== 'APPROVED') {
        errorMessage = `Sadece BEKLEYEN (PENDING) veya ONAYLANMIŞ (APPROVED) durumundaki rezervasyonlar iptal edilebilir. Mevcut durum: ${reservation.status}`;
      } else {
        // Zaman kontrolü
        let reservationTime;
        if (reservation.reservationTime.includes('T')) {
          const [datePart, timePart] = reservation.reservationTime.split('T');
          const [year, month, day] = datePart.split('-');
          const [hour, minute] = timePart.split(':');
          reservationTime = new Date(year, month - 1, day, hour, minute);
        } else {
          reservationTime = new Date(reservation.reservationTime);
        }
        
        const now = new Date();
        const minutesUntilReservation = (reservationTime.getTime() - now.getTime()) / (1000 * 60);
        
        if (minutesUntilReservation < 60) {
          errorMessage = `Rezervasyon saatine 60 dakikadan az kaldığı için iptal edilemez. Rezervasyon saati: ${reservationService.formatReservationTime(reservation.reservationTime)}, Kalan süre: ${Math.round(minutesUntilReservation)} dakika`;
        }
      }
      
      if (errorMessage) {
        showToast(errorMessage, 'error', 5000);
        return;
      }
    }
    
    setSelectedReservation(reservation);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const confirmCancelReservation = async () => {
    if (!selectedReservation) return;
    
    // İptal sebebi kontrolü
    if (!cancelReason || cancelReason.trim() === '') {
      showToast('İptal sebebi belirtilmelidir', 'error', 3000);
      return;
    }
    
    try {
      setCancelling(true);
      const updatedReservation = await reservationService.cancelReservation(
        selectedReservation.id,
        cancelReason.trim()
      );
      
      // Rezervasyon listesini güncelle
      setActiveReservations(prev => prev.filter(r => r.id !== selectedReservation.id));
      setPastReservations(prev => [
        {
          ...updatedReservation,
          status: 'CANCELLED',
        },
        ...prev
      ]);
      
      setSelectedReservation(null);
      setCancelReason('');
      setShowCancelModal(false);
      showToast('Rezervasyonunuz başarıyla iptal edildi', 'success', 3000);
    } catch (error) {
      // Hata mesajını göster
      const errorMessage = error.message || 'Rezervasyon iptal edilemedi';
      showToast(errorMessage, 'error', 5000);
    } finally {
      setCancelling(false);
    }
  };

  const cancelModal = () => {
    setSelectedReservation(null);
    setCancelReason('');
    setShowCancelModal(false);
  };

  const renderActiveReservation = ({ item }) => (
    <ReservationCard
      item={item}
      styles={styles}
      onCancel={handleCancelReservation}
      isPast={false}
      navigation={navigation}
    />
  );

  const renderPastReservation = ({ item }) => (
    <ReservationCard
      item={item}
      styles={styles}
      isPast={true}
      navigation={navigation}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity 
            onPress={handleBackPress}
            style={styles.backButton}
          >
            <FontAwesome name="arrow-left" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Rezervasyonlarım</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <TabButtons 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        styles={styles} 
      />

      {loading ? (
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Rezervasyonlar yüklenyor...</Text>
        </View>
      ) : activeTab === 'active' ? (
        <FlatList
          data={activeReservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderActiveReservation}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <EmptyState activeTab={activeTab} styles={styles} />
          )}
        />
      ) : (
        <FlatList
          data={pastReservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPastReservation}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <EmptyState activeTab={activeTab} styles={styles} />
          )}
        />
      )}

      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={cancelModal}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: theme.colors.card, borderRadius: 16, padding: 24, width: '100%', maxWidth: 400, elevation: 8 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <FontAwesome name="exclamation-triangle" size={48} color="#EF4444" style={{ marginBottom: 12 }} />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text, textAlign: 'center', marginBottom: 8 }}>
                Rezervasyonu İptal Et
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center' }}>
                İptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </Text>
            </View>
            
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>
                İptal Sebebi <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <TextInput
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 12,
                  minHeight: 100,
                  textAlignVertical: 'top',
                  color: theme.colors.text,
                  fontSize: 14,
                }}
                placeholder="İptal sebebinizi yazın..."
                placeholderTextColor={theme.colors.textTertiary}
                value={cancelReason}
                onChangeText={setCancelReason}
                multiline
                numberOfLines={4}
                maxLength={200}
                editable={!cancelling}
              />
              <Text style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: 4, textAlign: 'right' }}>
                {cancelReason.length}/200
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{ 
                  flex: 1,
                  backgroundColor: theme.colors.background,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={cancelModal}
                disabled={cancelling}
              >
                <Text style={{ color: theme.colors.text, fontWeight: 'bold', fontSize: 15 }}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ 
                  flex: 1,
                  backgroundColor: '#EF4444',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: cancelling ? 0.6 : 1
                }}
                onPress={confirmCancelReservation}
                disabled={cancelling || !cancelReason.trim()}
              >
                {cancelling ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>İptal Et</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onHide={hideToast}
      />
    </View>
  );
}