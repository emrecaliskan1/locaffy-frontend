import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Modal,
  ActivityIndicator,
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
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'error') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
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
        
        return resTime < now || res.status === 'REJECTED' || res.status === 'CANCELLED';
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
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const confirmCancelReservation = () => {
    if (selectedReservation) {
      setActiveReservations(prev => prev.filter(r => r.id !== selectedReservation.id));
      setPastReservations(prev => [
        {
          ...selectedReservation,
          status: 'iptal edildi',
          statusText: 'İptal Edildi',
        },
        ...prev
      ]);
      setSelectedReservation(null);
      setShowCancelModal(false);
    }
  };

  const cancelModal = () => {
    setSelectedReservation(null);
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
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 320, maxWidth: '90%', alignItems: 'center', elevation: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#B71C1C', marginBottom: 12 }}>İptal etmek istediğinize emin misiniz?</Text>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 18 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#E1E8ED', paddingHorizontal: 22, paddingVertical: 10, borderRadius: 8 }}
                onPress={cancelModal}
              >
                <Text style={{ color: '#2C3E50', fontWeight: 'bold', fontSize: 15 }}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#B71C1C', paddingHorizontal: 22, paddingVertical: 10, borderRadius: 8 }}
                onPress={confirmCancelReservation}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>İptal Et</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={3000}
        onHide={hideToast}
      />
    </View>
  );
}