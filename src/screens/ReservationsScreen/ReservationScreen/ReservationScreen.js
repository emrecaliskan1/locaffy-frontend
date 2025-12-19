import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  StatusBar,
  TextInput,
  Modal
} from 'react-native';
import Toast from '../../../components/Toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { reservationService } from '../../../services';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { styles } from './styles';

const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const monthNames = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];
const availableTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
const maxPeople = 12;

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
  const [reservationData, setReservationData] = useState({
    availableDates: [],
    availableTimes: availableTimes,
    maxPeople: maxPeople
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success', duration: 3000 });
  const timeScrollViewRef = useRef(null);

  const showToast = (message, type = 'error', duration = 3000) => {
    setToast({ visible: true, message, type, duration });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success', duration: 3000 });
  };

  // Mekanın çalışma günlerini kontrol et
  const getWorkingDays = () => {
    if (!restaurant.workingDays) return [];
    const dayMap = {
      'PAZAR': 0, 'PAZARTESİ': 1, 'SALI': 2, 'ÇARŞAMBA': 3,
      'PERŞEMBE': 4, 'CUMA': 5, 'CUMARTESİ': 6,
      // İngilizce formatlar
      'SUNDAY': 0, 'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3,
      'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6,
      // Türkçe küçük harf
      'Pazar': 0, 'Pazartesi': 1, 'Salı': 2, 'Çarşamba': 3,
      'Perşembe': 4, 'Cuma': 5, 'Cumartesi': 6,
    };
    let workingDayNumbers = [];
    const workingDays = restaurant.workingDays.trim();
    
    // Sayısal format kontrolü (1=Pazartesi, 7=Pazar)
    const numericPattern = /^[\d,\s-]+$/;
    if (numericPattern.test(workingDays)) {
      if (workingDays.includes('-')) {
        const [startDay, endDay] = workingDays.split('-').map(day => parseInt(day.trim()));
        if (!isNaN(startDay) && !isNaN(endDay)) {
          // Sayısal format: 1=Pazartesi, 7=Pazar -> JavaScript: 1=Pazartesi, 0=Pazar
          const startDayJS = startDay === 7 ? 0 : startDay;
          const endDayJS = endDay === 7 ? 0 : endDay;
          
          if (startDayJS <= endDayJS) {
            for (let i = startDayJS; i <= endDayJS; i++) {
              workingDayNumbers.push(i);
            }
          } else {
            for (let i = startDayJS; i <= 6; i++) {
              workingDayNumbers.push(i);
            }
            for (let i = 0; i <= endDayJS; i++) {
              workingDayNumbers.push(i);
            }
          }
        }
      } else if (workingDays.includes(',')) {
        const days = workingDays.split(',').map(day => {
          const num = parseInt(day.trim());
          return num === 7 ? 0 : num; // 7=Pazar -> 0
        }).filter(num => !isNaN(num) && num >= 0 && num <= 6);
        workingDayNumbers = days;
      } else {
        const num = parseInt(workingDays);
        if (!isNaN(num) && num >= 1 && num <= 7) {
          workingDayNumbers = [num === 7 ? 0 : num];
        }
      }
      return workingDayNumbers;
    }
    
    // Metin formatı
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
               workingDays === 'Hergün' || workingDays === 'Her gün') {
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
    const [startTime, endTime] = restaurant.openingHours.split('-').map(s => s.trim());
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    return { startHour, startMinute, endHour, endMinute };
  };
  
  // Saatin çalışma saatleri içinde olup olmadığını kontrol et
  const isTimeWithinWorkingHours = (time, dateString) => {
    const [timeHour, timeMinute] = time.split(':').map(Number);
    const timeInMinutes = timeHour * 60 + timeMinute;
    const restaurantStartTime = workingHours.startHour * 60 + workingHours.startMinute;
    const restaurantEndTime = workingHours.endHour * 60 + workingHours.endMinute;
    
    // Gece yarısını geçen saatler için özel kontrol
    if (restaurantEndTime < restaurantStartTime) {
      // Gece yarısını geçen saatler (örn: 22:00-02:00)
      return timeInMinutes >= restaurantStartTime || timeInMinutes <= restaurantEndTime;
    } else {
      // Normal saatler (örn: 09:00-22:00)
      return timeInMinutes >= restaurantStartTime && timeInMinutes <= restaurantEndTime;
    }
  };

  const workingDays = getWorkingDays();
  const workingHours = getWorkingHours();

  const generateNextDates = (n, startDate) => {
    const dates = [];
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    // Backend'den gelen tarihten başlayarak n gün oluştur
    for (let i = 0; i < n; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;
      dates.push(dateString);
    }
    
    return dates;
  };

  const [firstAvailableDate, setFirstAvailableDate] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchFirstAvailableDate = async () => {
      try {
        setLoading(true);
        // Backend'den ilk müsait tarihi al (ama bugünden başlatacağız)
        await reservationService.getFirstAvailableDate(restaurant.id);
        
        if (mounted) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          setFirstAvailableDate(today);
          
          // Takvimi bugünden başlat
          const dates = generateNextDates(14, today);
          setReservationData({
            availableDates: dates,
            availableTimes: availableTimes,
            maxPeople: maxPeople
          });
        }
      } catch (error) {
        console.log('Error fetching first available date:', error);
        if (mounted) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          setFirstAvailableDate(today);
          const dates = generateNextDates(14, today);
          setReservationData({
            availableDates: dates,
            availableTimes: availableTimes,
            maxPeople: maxPeople
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchFirstAvailableDate();

    return () => {
      mounted = false;
    };
  }, [restaurant.id]);

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
    
    // Seçilen tarihe göre en yakın saate scroll yap
    setTimeout(() => {
      scrollToFirstAvailableTime(date);
    }, 100);
  };

  const scrollToFirstAvailableTime = (date) => {
    if (!timeScrollViewRef.current) return;
    
    const today = new Date();
    const selectedDateOnly = new Date(date);
    selectedDateOnly.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    if (selectedDateOnly.getTime() === today.getTime()) {
      const now = new Date();
      
      let firstAvailableIndex = -1;
      for (let i = 0; i < reservationData.availableTimes.length; i++) {
        const time = reservationData.availableTimes[i];
        const [timeHour, timeMinute] = time.split(':').map(Number);
        const reservationDateTime = new Date();
        reservationDateTime.setHours(timeHour, timeMinute, 0, 0);
        
        // Hem geçmiş saat kontrolü hem de çalışma saati kontrolü
        const isPastTime = reservationDateTime <= now;
        const isWithinWorkingHours = isTimeWithinWorkingHours(time, date);
        
        if (!isPastTime && isWithinWorkingHours) {
          firstAvailableIndex = i;
          break;
        }
      }
      if (firstAvailableIndex > 0) {
        const scrollPosition = firstAvailableIndex * 83; // minWidth (75) + marginHorizontal (4*2)
        timeScrollViewRef.current.scrollTo({ x: scrollPosition, animated: true });
      }
    } else {
      // Gelecek tarih için ilk çalışma saatine scroll
      let firstWorkingHourIndex = -1;
      for (let i = 0; i < reservationData.availableTimes.length; i++) {
        const time = reservationData.availableTimes[i];
        if (isTimeWithinWorkingHours(time, date)) {
          firstWorkingHourIndex = i;
          break;
        }
      }
      if (firstWorkingHourIndex > 0) {
        const scrollPosition = firstWorkingHourIndex * 83;
        timeScrollViewRef.current.scrollTo({ x: scrollPosition, animated: true });
      } else {
        timeScrollViewRef.current.scrollTo({ x: 0, animated: true });
      }
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handlePeopleSelect = (people) => {
    setSelectedPeople(people);
  };

  const handleContinue = async () => {

    // Tarih ve saat kontrolü
    if (!selectedDate || !selectedTime) {
      showToast('Lütfen tarih ve saat seçin.', 'error');
      return;
    }
    
    // Kullanıcı kontrolü
    if (!user) {
      showToast('Rezervasyon yapmak için giriş yapmanız gerekiyor.', 'error');
      navigation.navigate('Auth');
      return;
    }
    
    // Kişi sayısı validasyonu
    if (!selectedPeople || selectedPeople <= 0) {
      showToast('Kişi sayısı en az 1 olmalıdır', 'error');
      return;
    }
    
    // Geçmiş tarih kontrolü
    const reservationDateTimeString = `${selectedDate}T${selectedTime}:00`;
    const reservationDateTime = new Date(reservationDateTimeString);
    const now = new Date();
    
    if (reservationDateTime <= now) {
      showToast(`Geçmiş bir tarih için rezervasyon yapılamaz: ${reservationDateTimeString}`, 'error');
      return;
    }
    
    // Çalışma günleri kontrolü
    const selectedDateObj = new Date(selectedDate);
    const dayOfWeek = selectedDateObj.getDay();
    if (!workingDays.includes(dayOfWeek)) {
      const dayNamesFull = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
      const workingDaysText = workingDays.map(d => dayNamesFull[d]).join(', ') || 'Belirtilmemiş';
      showToast(`Rezervasyon günü mekanın çalışma günleri dışındadır. Çalışma günleri: ${workingDaysText}, Rezervasyon günü: ${dayNamesFull[dayOfWeek]}`, 'error');
      return;
    }
    
    // Çalışma saatleri kontrolü
    if (!isTimeWithinWorkingHours(selectedTime, selectedDate)) {
      const openingHoursText = restaurant.openingHours || `${workingHours.startHour}:${String(workingHours.startMinute).padStart(2, '0')}-${workingHours.endHour}:${String(workingHours.endMinute).padStart(2, '0')}`;
      showToast(`Rezervasyon zamanı mekanın çalışma saatleri dışındadır. Çalışma saatleri: ${openingHoursText}, Rezervasyon zamanı: ${selectedTime}`, 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      
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
        showToast('Oturumunuzun süresi dolmuş. Lütfen tekrar giriş yapın.', 'error', 3000);
        setTimeout(() => navigation.navigate('Auth'), 1500);
      } else if (error.status === 400 || error.response?.status === 400) {
        // 400 Bad Request - Backend validasyon hataları
        const errorMessage = error.message || error.response?.data?.message || 'Rezervasyon oluşturulurken bir hata oluştu';
        
        // İptal oranı hatası - Mesajı parse et ve daha kullanıcı dostu göster
        if (errorMessage.includes('İptal oranınız çok yüksek') || errorMessage.includes('iptal oranınız çok yüksek')) {
          // Detayları çıkar
          const detailsMatch = errorMessage.match(/Son \d+ rezervasyonda: (\d+) iptal, (\d+) toplam/);
          let formattedMessage = 'İptal oranınız çok yüksek. Yeni rezervasyon oluşturamazsınız.';
          
          if (errorMessage.includes('Başarılı rezervasyonlar yaparak oranınızı düşürebilirsiniz')) {
            formattedMessage += ' Başarılı rezervasyonlar yaparak oranınızı düşürebilirsiniz.';
          }
          
          if (detailsMatch) {
            formattedMessage += `\n\nSon ${detailsMatch[2]} rezervasyonda: ${detailsMatch[1]} iptal, ${detailsMatch[2]} toplam`;
          }
          
          showToast(formattedMessage, 'error', 0); // Manuel kapatma
        }
        // Son 24 saatte çok fazla iptal hatası
        else if (errorMessage.includes('Son 24 saatte')) {
          // İptal sayısını çıkar
          const countMatch = errorMessage.match(/Son 24 saatte (\d+)/);
          let formattedMessage = 'Son 24 saatte çok fazla rezervasyon iptal ettiniz. Yeni rezervasyon oluşturamazsınız.';
          
          if (countMatch) {
            formattedMessage = `Son 24 saatte ${countMatch[1]} rezervasyon iptal ettiniz. Yeni rezervasyon oluşturamazsınız.`;
          }
          
          if (errorMessage.includes('Lütfen daha sonra tekrar deneyin')) {
            formattedMessage += '\n\nLütfen daha sonra tekrar deneyin.';
          }
          
          showToast(formattedMessage, 'error', 0);
        }
        // Çakışma hatalarını tespit et (mekan veya kullanıcı çakışması)
        else if (errorMessage.includes('zaten bir rezervasyon') || 
                 errorMessage.includes('zaten başka bir rezervasyonunuz')) {
          showToast(errorMessage, 'conflict', 0);
        } else {
          showToast(errorMessage, 'error', 4000);
        }
      } else {
        showToast(error.message || 'Rezervasyon oluşturulurken bir hata oluştu', 'error', 3000);
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
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const selectedDateObj = new Date(dateString);
    const isToday = selectedDateObj.toDateString() === today.toDateString();
    const isTomorrow = selectedDateObj.toDateString() === tomorrow.toDateString();
    
    // Seçilen tarihin çalışma günü olup olmadığını kontrol et
    const dayOfWeek = selectedDateObj.getDay();
    const isWorkingDay = workingDays.includes(dayOfWeek);

    return (
      <TouchableOpacity
        key={dateString}
        style={[
          styles.dateItem, 
          !isWorkingDay && { opacity: 0.4 }
        ]}
        onPress={() => isWorkingDay && handleDateSelect(dateString)}
        disabled={!isWorkingDay}
      >
        <Text style={[
          styles.dateFullDayLabel, 
          isSelected && { color: '#FFFFFF' },
          !isWorkingDay && styles.dateDayClosed
        ]}>
          {date.dayName}
        </Text>
        <View style={[
          styles.dateDayCircle,
          isSelected && styles.selectedDateCircle
        ]}>
          <Text style={[
            styles.dateDayNumber, 
            isSelected && styles.selectedDateNumberText,
            !isWorkingDay && styles.dateDayClosed
          ]}>
            {date.day}
          </Text>
        </View>
        {!isWorkingDay && (
          <Text style={styles.dateClosedText}>
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
      // Seçilen tarihin çalışma günü olup olmadığını kontrol et
      const selectedDateObj = new Date(selectedDate);
      const dayOfWeek = selectedDateObj.getDay();
      const isWorkingDay = workingDays.includes(dayOfWeek);
      
      if (!isWorkingDay) {
        isDisabled = true;
        disableReason = 'Mekan bugün kapalı';
      } else {
        // Çalışma saatleri kontrolü
        if (!isTimeWithinWorkingHours(time, selectedDate)) {
          isDisabled = true;
          disableReason = 'Mekan kapalı';
        }
        
        // Geçmiş saat kontrolü (bugün için)
        const today = new Date();
        const selectedDateOnly = new Date(selectedDate);
        selectedDateOnly.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        if (selectedDateOnly.getTime() === today.getTime()) {
          const [timeHour, timeMinute] = time.split(':').map(Number);
          const reservationDateTime = new Date(selectedDate);
          reservationDateTime.setHours(timeHour, timeMinute, 0, 0);
          const now = new Date();
          
          if (reservationDateTime <= now) {
            isDisabled = true;
            disableReason = 'Geçmiş saat';
          }
        }
      }
    }
    
    return (
      <TouchableOpacity
        key={time}
        style={[
          styles.timeSlot, 
          isSelected && styles.selectedTimeSlot, 
          isDisabled && styles.disabledTimeSlot
        ]}
        onPress={() => !isDisabled && handleTimeSelect(time)}
        disabled={isDisabled}
      >
        <Text style={[
          styles.timeText, 
          isSelected && styles.selectedTimeText,
          isDisabled && { color: '#888888' }
        ]}>
          {time}
        </Text>
        {isDisabled && disableReason && (
          <Text style={styles.timeSlotReason}>
            {disableReason}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  //Kişi sayısı renderlama
  const renderPeopleOption = (people) => {
    const isSelected = selectedPeople === people;
    return (
      <TouchableOpacity
        key={people}
        style={[
          styles.peopleOption,
          isSelected && styles.selectedPeopleOption
        ]}
        onPress={() => handlePeopleSelect(people)}>
        <View style={[
          styles.peopleIconContainer,
          isSelected && styles.selectedPeopleIconContainer
        ]}>
          <FontAwesome 
            name="user" 
            size={20} 
            color={isSelected ? '#FFFFFF' : theme.colors.primary}
          />
        </View>
        <Text style={[
          styles.peopleNumberText,
          isSelected && styles.selectedPeopleText
        ]}>
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
        <View style={styles.restaurantInfo}>
          <Text style={[styles.restaurantName, { color: theme.colors.text }]}>{restaurant.name}</Text>
          <Text style={[styles.restaurantType, { color: theme.colors.textSecondary }]}>
            {restaurant.type}
          </Text>
          {restaurant.address && (
            <Text 
              style={[styles.restaurantAddress, { color: theme.colors.textSecondary }]} 
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {restaurant.address}
            </Text>
          )}
        </View>

        {/* Kişi Sayısı Seçimi */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitleLarge, { color: theme.colors.text }]}>Kaç kişi için?</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.peopleScrollContainer}
            contentContainerStyle={styles.peopleContainer}
          >
            {Array.from({ length: reservationData.maxPeople }, (_, i) => i + 1).map(renderPeopleOption)}
          </ScrollView>
        </View>

        {/* Tarih Seçimi */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitleLarge, { color: theme.colors.text }]}>Hangi tarihte?</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.datesContainer}
            contentContainerStyle={styles.datesContent}
          >
            {reservationData.availableDates.map(renderDateItem)}
          </ScrollView>
        </View>

        {/* Saat Seçimi */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitleLarge, { color: theme.colors.text }]}>Saat kaçta?</Text>
          <ScrollView 
            ref={timeScrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.timesContainer}
            contentContainerStyle={styles.timesContent}
          >
            {reservationData.availableTimes.map(renderTimeSlot)}
          </ScrollView>
        </View>

        {/* Not Bölümü */}
        <View style={styles.section}>
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
        <View style={[styles.section, styles.summarySection]}>
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