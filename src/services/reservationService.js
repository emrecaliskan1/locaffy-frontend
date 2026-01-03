import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/reservations`;

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (e) {
    return null;
  }
};

const buildHeaders = async (extra = {}) => {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...extra,
  };
};

export const reservationService = {
  // USER
  createReservation: async (reservationData) => {
    try {
      const token = await getToken();
      
      const headers = await buildHeaders();

      const response = await axios.post(`${BASE_URL}`, reservationData, { headers });

      if (!response.data || !response.data.id) {
        throw new Error('Rezervasyon oluşturuldu ancak ID alınamadı');
      }
      
      return response.data;
    } catch (error) {

      if (error.response?.status === 401 || error.response?.status === 403) {
        const { authService } = require('./authService');
        await authService.clearToken();
        throw new Error('Oturumunuzun süresi dolmuş. Lütfen tekrar giriş yapın.');
      }
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Rezervasyon oluşturulurken bir hata oluştu';
        const validationError = new Error(errorMessage);
        validationError.status = 400;
        validationError.response = error.response;
        throw validationError;
      }
      const errorMessage = error.response?.data?.message || 'Rezervasyon oluşturulurken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  // USER 
  getUserReservations: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/my-reservations`, { headers });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Rezervasyonlar yüklenirken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  // BUSINESS OWNER
  updateReservationStatus: async (reservationId, status, rejectionReason = null) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.put(`${BASE_URL}/${reservationId}/status`, {
        status,
        rejectionReason
      }, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER - Rezervasyonu "Gerçekleşti" olarak işaretle
  completeReservation: async (reservationId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.post(`${BASE_URL}/${reservationId}/complete`, {}, { headers });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Rezervasyon tamamlanırken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  // BUSINESS OWNER 
  getPlaceReservations: async (placeId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/place/${placeId}`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUBLIC - İlk müsait tarihi al
  getFirstAvailableDate: async (placeId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/place/${placeId}/first-available-date`, { headers });
      return response.data.firstAvailableDate;
    } catch (error) {
      console.log('Error fetching first available date:', error);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow.toISOString();
    }
  },

  // USER - Rezervasyon iptal etme
  cancelReservation: async (reservationId, reason) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.put(`${BASE_URL}/${reservationId}/cancel`, {
        reason
      }, { headers });
      return response.data;
    } catch (error) {

      if (error.response?.status === 401 || error.response?.status === 403) {
        const { authService } = require('./authService');
        await authService.clearToken();
        throw new Error('Oturumunuzun süresi dolmuş. Lütfen tekrar giriş yapın.');
      }
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Rezervasyon iptal edilemedi';
        const validationError = new Error(errorMessage);
        validationError.status = 400;
        validationError.response = error.response;
        throw validationError;
      }
      
      if (error.response?.status === 404) {
        const errorMessage = error.response?.data?.message || 'Rezervasyon bulunamadı';
        throw new Error(errorMessage);
      }
      
      const errorMessage = error.response?.data?.message || 'Rezervasyon iptal edilemedi';
      throw new Error(errorMessage);
    }
  },

  // Rezervasyonun iptal edilip edilemeyeceğini kontrol et 
  canCancelReservation: (reservation) => {
    if (reservation.status !== 'PENDING' && reservation.status !== 'APPROVED') {
      return false;
    }
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
    
    return minutesUntilReservation >= 60;
  },


  //Geçmiş rezervasyonlar için kontrol
  isReservationPast: (reservationTime) => {
    let dateToCheck;
    
    if (reservationTime.includes('T')) {
      const [datePart, timePart] = reservationTime.split('T');
      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');
      
      dateToCheck = new Date(year, month - 1, day, hour, minute);
    } else {
      dateToCheck = new Date(reservationTime);
    }
    
    const now = new Date();
    return dateToCheck < now;
  },

  // Aynı gün aynı mekana PENDING rezervasyon kontrolü
  checkSameDayPendingReservation: async (placeId, newReservationTime) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/my-reservations`, { headers });
      const reservations = response.data;
      
      const newDateTime = new Date(newReservationTime);
      const newDateOnly = new Date(newDateTime.getFullYear(), newDateTime.getMonth(), newDateTime.getDate());
      
      // Aynı mekana, aynı gün içinde PENDING durumunda rezervasyon var mı kontrol et
      const sameDayPendingReservation = reservations.find(reservation => {
        if (reservation.placeId !== placeId) {
          return false;
        }
        
        if (reservation.status !== 'PENDING') {
          return false;
        }
        
        let reservationDateTime;
        if (reservation.reservationTime.includes('T')) {
          reservationDateTime = new Date(reservation.reservationTime);
        } else {
          reservationDateTime = new Date(reservation.reservationTime);
        }
        
        const reservationDateOnly = new Date(
          reservationDateTime.getFullYear(), 
          reservationDateTime.getMonth(), 
          reservationDateTime.getDate()
        );
        
        return reservationDateOnly.getTime() === newDateOnly.getTime();
      });
      
      if (sameDayPendingReservation) {
        return {
          hasPending: true,
          pendingReservation: sameDayPendingReservation
        };
      }
      
      return { hasPending: false };
    } catch (error) {
      return { hasPending: false };
    }
  },

  // Zaman çakışması kontrolü - yeni rezervasyonun mevcut rezervasyonlarla çakışıp çakışmadığını kontrol et
  checkTimeConflict: async (newReservationTime) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/my-reservations`, { headers });
      const reservations = response.data;
      
      const newDateTime = new Date(newReservationTime);
      const now = new Date();
      
      // Sadece PENDING veya APPROVED durumundaki VE gelecekteki rezervasyonları filtrele
      // CANCELLED, REJECTED, COMPLETED, NO_SHOW durumundakiler dahil edilmez
      const activeReservations = reservations.filter(r => {
  
        const isActiveStatus = r.status === 'PENDING' || r.status === 'APPROVED';
        if (!isActiveStatus) {
          return false;
        }
        
        // Gelecekte olup olmadığını kontrol et
        let reservationDateTime;
        if (r.reservationTime.includes('T')) {
          reservationDateTime = new Date(r.reservationTime);
        } else {
          reservationDateTime = new Date(r.reservationTime);
        }
        const isFuture = reservationDateTime > now;
        
        return isFuture;
      });
      
      for (const reservation of activeReservations) {
        let existingDateTime;
        
        if (reservation.reservationTime.includes('T')) {
          existingDateTime = new Date(reservation.reservationTime);
        } else {
          existingDateTime = new Date(reservation.reservationTime);
        }
      
        const timeDifferenceInMinutes = Math.abs(newDateTime - existingDateTime) / (1000 * 60);
        
        if (timeDifferenceInMinutes < 120) {
          return {
            hasConflict: true,
            conflictingReservation: reservation,
            timeDifference: timeDifferenceInMinutes
          };
        }
      }
      
      return { hasConflict: false };
    } catch (error) {
      return { hasConflict: false }; 
    }
  },



  //DATE FORMATLAMA İŞLERİ
  formatReservationTime: (reservationTime) => {
    let dateStr = reservationTime;
    
    if (dateStr.includes('T')) {
      const [datePart, timePart] = dateStr.split('T');
      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');
      
      return `${day}.${month}.${year} ${hour}:${minute}`;
    }
    
    const date = new Date(reservationTime);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  getReservationStatusText: (status) => {
    const statusMap = {
      PENDING: 'Beklemede',
      APPROVED: 'Onaylandı',
      COMPLETED: 'Tamamlandı',
      NO_SHOW: 'Gelmedi',
      REJECTED: 'Reddedildi',
      CANCELLED: 'İptal Edildi'
    };
    return statusMap[status] || status;
  },


  
  //REZERVASYONLAR İÇİN STATUS DURUMLARI
  getPastReservationStatusText: (status, reservationTime) => {
    if (status === 'NO_SHOW') {
      return 'Gelmedi';
    }
    if (status === 'COMPLETED') {
      return 'Tamamlandı';
    }

    if (reservationService.isReservationPast(reservationTime)) {
      if (status === 'PENDING') {
        return 'İptal Edildi'; 
      }
      if (status === 'APPROVED') {
        return 'Onaylandı'; 
      }
    }
    return reservationService.getReservationStatusText(status);
  },

  //Geçmiş rezervasyonlar için status color
  getPastReservationStatusColor: (status, reservationTime) => {
    if (status === 'NO_SHOW') {
      return 'rgba(156, 10, 10, 0.7)';
    }
    if (status === 'COMPLETED') {
      return 'rgba(2, 136, 209, 0.7)'; 
    }
    
    if (reservationService.isReservationPast(reservationTime)) {
      if (status === 'PENDING') {
        return 'rgba(158, 158, 158, 0.7)'; 
      }
      if (status === 'APPROVED') {
        return 'rgba(76, 175, 80, 0.7)'; 
      }
    }
    return reservationService.getReservationStatusColor(status);
  },

  getReservationStatusColor: (status) => {
    const colorMap = {
      PENDING: 'rgba(255, 165, 0, 0.7)',
      APPROVED: 'rgba(54, 168, 60, 0.7)', 
      COMPLETED: 'rgba(2, 136, 209, 0.7)',
      NO_SHOW: 'rgba(156, 10, 10, 0.7)', 
      REJECTED: 'rgba(244, 67, 54, 0.7)', 
      CANCELLED: 'rgba(158, 158, 158, 0.7)'
    };
    return colorMap[status] || 'rgba(158, 158, 158, 0.7)';
  }
};

export default reservationService;