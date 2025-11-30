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
import { reservationService } from '../../../services';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const monthNames = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];
const availableTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
const maxPeople = 8;

export default function ReservationScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const { user } = useAuth();
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(2);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mekanın çalışma günlerini kontrol et
  const getWorkingDays = () => {
    if (!restaurant.workingDays) return [];

    const dayMap = {
      // Yeni format
      'PAZAR': 0, 'PAZARTESİ': 1, 'SALI': 2, 'ÇARŞAMBA': 3,
      'PERŞEMBE': 4, 'CUMA': 5, 'CUMARTESİ': 6,
      // Eski format (geriye dönük uyumluluk)
      'Pazar': 0, 'Pazartesi': 1, 'Salı': 2, 'Çarşamba': 3,
      'Perşembe': 4, 'Cuma': 5, 'Cumartesi': 6
    };

    let workingDayNumbers = [];
    const workingDays = restaurant.workingDays.trim();
    
    if (workingDays.includes('-')) {
      const [startDay, endDay] = workingDays.split('-').map(day => day.trim());
      const startDayNum = dayMap[startDay];
      const endDayNum = dayMap[endDay];
      
      if (startDayNum !== undefined && endDayNum !== undefined) {
        if (startDayNum <= endDayNum) {
          for (let i = startDayNum; i <= endDayNum; i++) {
            workingDayNumbers.push(i);
          }
        } else {
          for (let i = startDayNum; i <= 6; i++) {
            workingDayNumbers.push(i);
          }
          for (let i = 0; i <= endDayNum; i++) {
            workingDayNumbers.push(i);
          }
        }
      }
    } else if (workingDays.includes(',')) {
      const days = workingDays.split(',').map(day => day.trim());
      workingDayNumbers = days.map(day => dayMap[day]).filter(num => num !== undefined);
    } else if (workingDays === 'PAZARTESİ,SALI,ÇARŞAMBA,PERŞEMBE,CUMA,CUMARTESİ,PAZAR' || 
               workingDays === 'Pazartesi-Pazar' || 
               workingDays === 'Hergün') {
      workingDayNumbers = [0, 1, 2, 3, 4, 5, 6];
    } else {
      const dayNum = dayMap[workingDays];
      if (dayNum !== undefined) {
        workingDayNumbers = [dayNum];
      }
    }
    return workingDayNumbers;
  };

  // Mekanın çalışma saatlerini al
  const getWorkingHours = () => {
    if (!restaurant.openingHours || !restaurant.openingHours.includes('-')) {
      return { startHour: 9, startMinute: 0, endHour: 18, endMinute: 0 };
    }
    const [startTime, endTime] = restaurant.openingHours.split('-');
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    return { startHour, startMinute, endHour, endMinute };
  };

  const workingDays = getWorkingDays();
  const workingHours = getWorkingHours();

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
    setSelectedTime(null);
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

  //Tarih renderlama
  const renderDateItem = (dateString) => {
    const date = formatDate(dateString);
    const isSelected = selectedDate === dateString;
    const today = new Date();
    const isToday = (new Date(dateString).toDateString() === today.toDateString());
    
    // Seçilen tarihin çalışma günü olup olmadığını kontrol et
    const selectedDateObj = new Date(dateString);
    const dayOfWeek = selectedDateObj.getDay();
    const isWorkingDay = workingDays.includes(dayOfWeek);

    return (
      <TouchableOpacity
        key={dateString}
        style={[
          styles.dateItem, 
          isSelected && styles.selectedDateItem, 
          isToday && styles.todayDateItem,
          !isWorkingDay && { backgroundColor: '#F5F5F5', opacity: 0.6 }
        ]}
        onPress={() => isWorkingDay && handleDateSelect(dateString)}
        disabled={!isWorkingDay}
      >
        <Text style={[
          styles.dateDay, 
          isSelected && styles.selectedDateText,
          !isWorkingDay && { color: '#999', opacity: 0.5 }
        ]}>
          {date.day}
        </Text>
        <Text style={[
          styles.dateMonth, 
          isSelected && styles.selectedDateText,
          !isWorkingDay && { color: '#999', opacity: 0.5 }
        ]}>
          {date.dayName} · {date.month}
        </Text>
        {!isWorkingDay && (
          <Text style={{
            fontSize: 8,
            color: '#999',
            textAlign: 'center',
            marginTop: 2
          }}>
            Kapalı
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  //Saat dilimi renderlama
  const renderTimeSlot = (time) => {
    const isSelected = selectedTime === time;
    let isDisabled = false;
    let disableReason = '';
    
    if (selectedDate) {
      const [timeHour, timeMinute] = time.split(':').map(Number);
      const timeInMinutes = timeHour * 60 + timeMinute;
      
      // Mekanın çalışma saatleri kontrolü
      const restaurantStartTime = workingHours.startHour * 60 + workingHours.startMinute;
      const restaurantEndTime = workingHours.endHour * 60 + workingHours.endMinute;
      
      if (timeInMinutes < restaurantStartTime || timeInMinutes > restaurantEndTime) {
        isDisabled = true;
        disableReason = 'Mekan kapalı';
      }
      
      // Bugün için geçmiş saat kontrolü
      const today = new Date();
      const sel = new Date(selectedDate);
      if (sel.toDateString() === today.toDateString()) {
        const currentTime = today.getHours() * 60 + today.getMinutes();
        // Geçmiş saatleri devre dışı bırak
        if (timeInMinutes <= currentTime) {
          isDisabled = true;
          disableReason = 'Geçmiş saat';
        }
      }
    }
    
    return (
      <TouchableOpacity
        key={time}
        style={[styles.timeSlot, isSelected && styles.selectedTimeSlot, isDisabled && styles.disabledTimeSlot]}
        onPress={() => !isDisabled && handleTimeSelect(time)}
        disabled={isDisabled}
      >
        <Text style={[
          styles.timeText, 
          isSelected && styles.selectedTimeText,
          isDisabled && { color: '#666666' }
        ]}>
          {time}
        </Text>
      </TouchableOpacity>
    );
  };

  //Kişi sayısı renderlama
  const renderPeopleOption = (people) => {
    const isSelected = selectedPeople === people;
    return (
      <TouchableOpacity
        key={people}
        style={[styles.peopleOption, isSelected && styles.selectedPeopleOption]}
        onPress={() => handlePeopleSelect(people)}>
        <Text style={[styles.peopleText, isSelected && styles.selectedPeopleText]}>
          {people}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome name="arrow-left" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Rezervasyon</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={[styles.loadingWrapper, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Tarihler yüklenyor...</Text>
          </View>
        )}
        {/* Restoran Bilgileri */}
        <View style={[styles.restaurantInfo, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.restaurantName, { color: theme.colors.text }]}>{restaurant.name}</Text>
          <Text style={[styles.restaurantType, { color: theme.colors.textSecondary }]}>{restaurant.type}</Text>
        </View>

        {/* Tarih Seçimi */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <FontAwesome name="calendar" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 0 }]}>Tarih Seçin</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.datesContainer}
            contentContainerStyle={styles.datesContent}
          >
            {(reservationData ? reservationData.availableDates : mockReservationData.availableDates).map(renderDateItem)}
          </ScrollView>
        </View>

        {/* Kişi Sayısı Seçimi */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <FontAwesome name="users" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 0 }]}>Kişi Sayısı</Text>
          </View>
          <View style={styles.peopleContainer}>
            {Array.from({ length: (reservationData ? reservationData.maxPeople : mockReservationData.maxPeople) }, (_, i) => i + 1).map(renderPeopleOption)}
          </View>
        </View>

        {/* Saat Seçimi */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <FontAwesome name="clock-o" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 0 }]}>Saat Seçin</Text>
          </View>
          <View style={styles.timesContainer}>
            {(reservationData ? reservationData.availableTimes : mockReservationData.availableTimes).map(renderTimeSlot)}
          </View>
        </View>

        {/* Not Bölümü */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <FontAwesome name="sticky-note" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 0 }]}>Notunuz (İsteğe Bağlı)</Text>
          </View>
          <TextInput
            style={[styles.noteInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="Özel istekleriniz, alerji durumu vs..."
            placeholderTextColor={theme.colors.textTertiary}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            maxLength={200}
          />
          <Text style={[styles.charCount, { color: theme.colors.textTertiary }]}>{note.length}/200</Text>
        </View>

        {/* Seçim özeti + Temizle butonu */}
        <View style={[styles.section, styles.summarySection, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Rezervasyon Bilgileri</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Tarih:</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>{selectedDate ? formatDate(selectedDate).full : 'Seçilmedi'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Saat:</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>{selectedTime || 'Seçilmedi'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Kişi:</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>{selectedPeople}</Text>
          </View>
          <View style={styles.summaryActions}>
            <TouchableOpacity style={[styles.clearButton, { backgroundColor: theme.colors.background }]} onPress={() => {
              setSelectedDate(null);
              setSelectedTime(null);
              setSelectedPeople(2);
              setNote('');
            }}>
              <Text style={[styles.clearButtonText, { color: theme.colors.text }]}>Temizle</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              { backgroundColor: theme.colors.primary },
              (!selectedDate || !selectedTime || submitting) && { backgroundColor: theme.colors.border }
            ]}
            onPress={handleContinue}
            disabled={!selectedDate || !selectedTime || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={[styles.continueButtonText, { color: '#FFFFFF' }]}>Rezervasyon İsteği Gönder</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal Gösterimi*/}
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
    backgroundColor: '#667eea',
    borderColor: '#667eea',
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
    backgroundColor: '#667eea',
    borderColor: '#667eea',
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
    backgroundColor: '#667eea',
    borderColor: '#667eea',
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
    backgroundColor: '#9E9E9E',
    borderColor: '#757575',
    opacity: 0.6,
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