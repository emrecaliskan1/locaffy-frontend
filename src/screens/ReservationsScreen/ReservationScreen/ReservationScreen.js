import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  StatusBar,
  TextInput,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { dayNames, monthNames, availableTimes, maxPeople } from '../../../static-data';
import { reservationService } from '../../../services';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';

export default function ReservationScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(2);
  const [note, setNote] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mock data - Backend'den gelecek
  // generate next N dates as ISO strings (yyyy-mm-dd)
  const generateNextDates = (n) => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < n; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dates.push(`${yyyy}-${mm}-${dd}`);
    }
    return dates;
  };

  const mockReservationData = {
    availableDates: generateNextDates(14),
    availableTimes: availableTimes,
    maxPeople: maxPeople
  };

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (!mounted) return;
      setReservationData(mockReservationData);
      setLoading(false);
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    return {
      day: date.getDate(),
      dayName: dayNames[date.getDay()],
      month: monthNames[date.getMonth()],
      full: `${date.getDate()} ${monthNames[date.getMonth()]}`
    };
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handlePeopleSelect = (people) => {
    setSelectedPeople(people);
  };

  const handleContinue = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Eksik bilgi', 'Lütfen tarih ve saat seçin.');
      return;
    }

    // User kontrolü
    if (!user) {
      Alert.alert('Giriş Gerekli', 'Rezervasyon yapmak için giriş yapmanız gerekiyor.');
      navigation.navigate('Auth');
      return;
    }

    try {
      setSubmitting(true);

      const [hours, minutes] = selectedTime.split(':');
      
      const reservationDateTimeString = `${selectedDate}T${selectedTime}:00`;

      const reservationData = {
        placeId: restaurant.id,
        reservationTime: reservationDateTimeString,
        numberOfPeople: selectedPeople,
        note: note.trim() || null,
      };
      
      const response = await reservationService.createReservation(reservationData);
      
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedPeople(2);
        setNote('');
        navigation.navigate('Reservations', { fromRestaurant: true });
      }, 2500);
    } catch (error) {
      setShowSuccessModal(false);
      
      // Auth hatası varsa login screen'e yönlendir
      if (error.message.includes('Oturumunuzun süresi dolmuş') || 
          error.response?.status === 401 || 
          error.response?.status === 403) {
        Alert.alert(
          'Giriş Gerekli',
          'Oturumunuzun süresi dolmuş. Lütfen tekrar giriş yapın.',
          [
            {
              text: 'Giriş Yap',
              onPress: () => navigation.navigate('Auth')
            }
          ]
        );
      } else {
        Alert.alert('Hata', error.message || 'Rezervasyon oluşturulurken bir hata oluştu');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderDateItem = (dateString) => {
    const date = formatDate(dateString);
    const isSelected = selectedDate === dateString;
    const today = new Date();
    const isToday = (new Date(dateString).toDateString() === today.toDateString());

    return (
      <TouchableOpacity
        key={dateString}
        style={[styles.dateItem, isSelected && styles.selectedDateItem, isToday && styles.todayDateItem]}
        onPress={() => handleDateSelect(dateString)}
      >
        <Text style={[styles.dateDay, isSelected && styles.selectedDateText]}>
          {date.day}
        </Text>
        <Text style={[styles.dateMonth, isSelected && styles.selectedDateText]}>
          {date.dayName} · {date.month}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTimeSlot = (time) => {
    const isSelected = selectedTime === time;
    // If selected date is today, disable times that are in the past
    let isDisabled = false;
    if (selectedDate) {
      const today = new Date();
      const sel = new Date(selectedDate);
      if (sel.toDateString() === today.toDateString()) {
        // compare hours and minutes
        const [h, m] = time.split(':').map(Number);
        const slot = new Date();
        slot.setHours(h, m, 0, 0);
        if (slot.getTime() <= Date.now()) {
          isDisabled = true;
        }
      }
    }
    
    return (
      <TouchableOpacity
        key={time}
        style={[styles.timeSlot, isSelected && styles.selectedTimeSlot, isDisabled && styles.disabledTimeSlot]}
        onPress={() => !isDisabled && handleTimeSelect(time)}
      >
        <Text style={[styles.timeText, isSelected && styles.selectedTimeText]}>
          {time}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPeopleOption = (people) => {
    const isSelected = selectedPeople === people;
    
    return (
      <TouchableOpacity
        key={people}
        style={[styles.peopleOption, isSelected && styles.selectedPeopleOption]}
        onPress={() => handlePeopleSelect(people)}
      >
        <Text style={[styles.peopleText, isSelected && styles.selectedPeopleText]}>
          {people}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rezervasyon</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#FF6B35" />
            <Text style={styles.loadingText}>Tarihler yükleniyor...</Text>
          </View>
        )}
        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantType}>{restaurant.type}</Text>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Tarih Seçin</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.datesContainer}
            contentContainerStyle={styles.datesContent}
          >
            {(reservationData ? reservationData.availableDates : mockReservationData.availableDates).map(renderDateItem)}
          </ScrollView>
        </View>

        {/* People Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Kişi Sayısı</Text>
          <View style={styles.peopleContainer}>
            {Array.from({ length: (reservationData ? reservationData.maxPeople : mockReservationData.maxPeople) }, (_, i) => i + 1).map(renderPeopleOption)}
          </View>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕐 Saat Seçin</Text>
          <View style={styles.timesContainer}>
            {(reservationData ? reservationData.availableTimes : mockReservationData.availableTimes).map(renderTimeSlot)}
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Notunuz (İsteğe Bağlı)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Özel istekleriniz, alerji durumu vs..."
            placeholderTextColor="#95A5A6"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            maxLength={200}
          />
          <Text style={styles.charCount}>{note.length}/200</Text>
        </View>

        {/* Selection summary + Clear button */}
        <View style={[styles.section, styles.summarySection]}>
          <Text style={styles.sectionTitle}>Rezervasyon Bilgileri</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tarih:</Text>
            <Text style={styles.summaryValue}>{selectedDate ? formatDate(selectedDate).full : 'Seçilmedi'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Saat:</Text>
            <Text style={styles.summaryValue}>{selectedTime || 'Seçilmedi'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Kişi:</Text>
            <Text style={styles.summaryValue}>{selectedPeople}</Text>
          </View>
          <View style={styles.summaryActions}>
            <TouchableOpacity style={styles.clearButton} onPress={() => {
              setSelectedDate(null);
              setSelectedTime(null);
              setSelectedPeople(2);
              setNote('');
            }}>
              <Text style={styles.clearButtonText}>Temizle</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              (!selectedDate || !selectedTime || submitting) && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={!selectedDate || !selectedTime || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>Rezervasyon İsteği Gönder</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.tickContainer}>
              <FontAwesome name="check-circle" size={60} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>Rezervasyon İsteğiniz Gönderilmiştir</Text>
            <Text style={styles.successMessage}>
              Mekan yetkililerinin onayı beklenmektedir.
            </Text>
            <ActivityIndicator size="small" color="#4CAF50" style={{ marginTop: 10 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#2C3E50',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  restaurantInfo: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  restaurantType: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  datesContainer: {
    marginHorizontal: -5,
  },
  datesContent: {
    paddingHorizontal: 5,
  },
  dateItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    minWidth: 70,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDateItem: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  dateDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  peopleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  peopleOption: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 50,
    alignItems: 'center',
  },
  selectedPeopleOption: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  peopleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  selectedPeopleText: {
    color: '#FFFFFF',
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  selectedTimeText: {
    color: '#FFFFFF',
  },
  disabledTimeSlot: {
    backgroundColor: '#ECEFF1',
    borderColor: '#CBD5DB',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#E1E8ED',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingWrapper: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#7F8C8D',
  },
  todayDateItem: {
    borderWidth: 1.5,
    borderColor: '#2C3E50',
  },
  summarySection: {
    marginHorizontal: 20,
    paddingVertical: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#7F8C8D',
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  summaryActions: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#E1E8ED',
  },
  clearButtonText: {
    color: '#2C3E50',
    fontWeight: '600',
  },
  noteInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E1E8ED',
    minHeight: 80,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  tickContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
});