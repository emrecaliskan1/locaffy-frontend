import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  FlatList,
  BackHandler
} from 'react-native';
import { styles } from './styles';
import { mockReservations } from '../../static-data';
import { ReservationCard, TabButtons, EmptyState } from '../../components/Reservations';
import { Alert, Linking, Animated, Modal, Pressable } from 'react-native';

export default function ReservationsScreen({ route, navigation }) {
  const [activeTab, setActiveTab] = useState('active');
  const from = route?.params?.from;
  // Local mock state to simulate cancellation and move to completed
  const [reservations, setReservations] = useState({
    active: mockReservations.active.slice(),
    completed: mockReservations.completed.slice(),
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const successOpacity = useState(new Animated.Value(0))[0];
  const successScale = useState(new Animated.Value(0.8))[0];
  const [confirmItem, setConfirmItem] = useState(null);

  const handleClose = () => {
    // If opened from Profile, go to Profile tab
    if (from === 'profile') {
      navigation.navigate('Main', { screen: 'Profile' });
      return true;
    }

    // If opened from Restaurant flow, navigate to Home (Mekanlar) tab
    if (from === 'restaurant') {
      navigation.navigate('Main', { screen: 'Home' });
      return true;
    }

    // Default behavior: go back if possible, otherwise navigate to Main
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }

    navigation.navigate('Main');
    return true;
  };

  // Handle Android hardware back to use the same logic
  useEffect(() => {
    const onBackPress = () => handleClose();
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [from]);

  // If coming back from ReviewScreen with reviewedId, mark it as reviewed
  useEffect(() => {
    const reviewedId = route?.params?.reviewedId;
    if (reviewedId) {
      setReservations(prev => {
        const completed = prev.completed.map(r => r.id === reviewedId ? { ...r, isReviewed: true } : r);
        return { ...prev, completed };
      });
      // clear the param so it doesn't re-run
      navigation.setParams({ reviewedId: undefined });
    }
  }, [route?.params?.reviewedId]);

  const handleCall = async (item) => {
    const phone = item.phone;
    if (!phone) {
      Alert.alert('Hata', 'Restoran telefonu bulunmuyor.');
      return;
    }
    const url = `tel:${phone}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Hata', 'Bu cihaz arama yapamıyor.');
      }
    } catch (e) {
      Alert.alert('Hata', 'Arama başlatılamadı.');
    }
  };

  const playSuccessAnimation = () => {
    setShowSuccess(true);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(successOpacity, { toValue: 1, duration: 300, useNativeDriver: false }),
        Animated.spring(successScale, { toValue: 1.08, friction: 6, useNativeDriver: false }),
      ]),
      Animated.delay(900),
      Animated.parallel([
        Animated.timing(successOpacity, { toValue: 0, duration: 300, useNativeDriver: false }),
        Animated.timing(successScale, { toValue: 0.8, duration: 300, useNativeDriver: false }),
      ])
    ]).start(() => {
      // reset values
      successOpacity.setValue(0);
      successScale.setValue(0.8);
      setShowSuccess(false);
    });
  };

  const handleCancelReservation = (item) => {
    console.log('handleCancelReservation called for', item?.id, item?.restaurantName);
    // open in-app confirmation modal (more reliable on web)
    setConfirmItem(item);
  };

  const confirmCancel = () => {
    const item = confirmItem;
    if (!item) return;
    console.log('User confirmed cancellation for', item.id);
    setReservations(prev => {
      const active = prev.active.filter(r => r.id !== item.id);
      const cancelled = { ...item, status: 'iptal-edildi', statusText: 'İptal Edildi', cancellationDate: new Date().toISOString() };
      const completed = [cancelled, ...prev.completed];
      return { active, completed };
    });
    playSuccessAnimation();
    setConfirmItem(null);
  };

  const cancelConfirm = () => {
    console.log('User cancelled cancellation modal');
    setConfirmItem(null);
  };

  const handleReview = (item) => {
    // pass along the originating 'from' so Review can restore correct return behavior
    navigation.navigate('Review', { reservation: item, from });
  };

  const renderReservationItem = ({ item }) => {
    return <ReservationCard item={item} styles={styles} onCancel={handleCancelReservation} onCall={handleCall} onReview={handleReview} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rezervasyonlarım</Text>
        <View style={styles.placeholder} />
      </View>

      <TabButtons 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        styles={styles} 
      />

      <FlatList
        data={reservations[activeTab]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReservationItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <EmptyState activeTab={activeTab} styles={styles} />
        )}
      />

      {showSuccess && (
        <Animated.View style={{
          position: 'absolute',
          top: '42%',
          left: 0,
          right: 0,
          alignItems: 'center',
          opacity: successOpacity,
          transform: [{ scale: successScale }]
        }} pointerEvents="none">
          <View style={{ alignItems: 'center' }}>
            <View style={{
              backgroundColor: '#E74C3C',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 24,
              elevation: 8,
              borderWidth: 1,
              borderColor: '#B71C1C',
              // iOS shadow
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.18,
              shadowRadius: 8,
            }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', userSelect: 'none' }}>İptal Edildi</Text>
            </View>
          </View>
        </Animated.View>
      )}
      <Modal
        visible={!!confirmItem}
        transparent
        animationType="fade"
        onRequestClose={cancelConfirm}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '85%', backgroundColor: '#fff', padding: 20, borderRadius: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 10 }}>Rezervasyonu iptal etmek istediğinizden emin misiniz?</Text>
            <Text style={{ color: '#7F8C8D', marginBottom: 20 }}>{confirmItem?.restaurantName}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Pressable onPress={cancelConfirm} style={{ padding: 10, marginRight: 8 }}>
                <Text style={{ color: '#7F8C8D' }}>Vazgeç</Text>
              </Pressable>
              <Pressable onPress={confirmCancel} style={{ padding: 10, backgroundColor: '#E74C3C', borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Evet, İptal Et</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}