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
import { reservationService, calendarReminderService } from '../../services';
import { useToast, useReservations } from '../../hooks';


export default function ReservationsScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState('active');
  const { fromProfile, fromRestaurant } = route.params || {};
  const { theme } = useTheme();

  // Custom Hooks
  const { toast, showToast, hideToast } = useToast();
  const { 
    activeReservations, 
    pastReservations, 
    loading, 
    loadReservations,
    cancelReservation: cancelReservationHook,
    canCancelReservation 
  } = useReservations();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Değerlendirme sonrası güncelleme için listener
  useEffect(() => {
    loadReservations();
    const unsubscribe = navigation.addListener('focus', () => {
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
    // Hook'tan gelen canCancelReservation fonksiyonunu kullan
    if (!canCancelReservation(reservation)) {
      let errorMessage = '';
      
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
    if (!cancelReason || cancelReason.trim() === '') {
      showToast('İptal sebebi belirtilmelidir', 'error', 3000);
      return;
    }
    
    try {
      setCancelling(true);
      
      const result = await cancelReservationHook(selectedReservation.id, cancelReason.trim());
      
      // Takvim hatırlatıcısını sil
      await calendarReminderService.deleteReminder(selectedReservation.id);
      
      if (result.success) {
        setSelectedReservation(null);
        setCancelReason('');
        setShowCancelModal(false);
        showToast('Rezervasyonunuz başarıyla iptal edildi', 'success', 3000);
      } else {
        showToast(result.message || 'Rezervasyon iptal edilemedi', 'error', 5000);
      }
    } catch (error) {
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
      onShowToast={showToast}
    />
  );

  const renderPastReservation = ({ item }) => (
    <ReservationCard
      item={item}
      styles={styles}
      isPast={true}
      navigation={navigation}
      onShowToast={showToast}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.header, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Rezervasyonlarım</Text>
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
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Rezervasyonlar yükleniyor...</Text>
        </View>
      ) : activeTab === 'active' ? (
        <FlatList
          data={activeReservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderActiveReservation}
          contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <EmptyState activeTab={activeTab} styles={styles} navigation={navigation} />
          )}
        />
      ) : (
        <FlatList
          data={pastReservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPastReservation}
          contentContainerStyle={[styles.listContainer, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <EmptyState activeTab={activeTab} styles={styles} navigation={navigation} />
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