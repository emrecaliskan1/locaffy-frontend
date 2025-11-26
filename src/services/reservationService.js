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
        // Token geçersiz, logout yap
        const { authService } = require('./authService');
        await authService.clearToken();
        throw new Error('Oturumunuzun süresi dolmuş. Lütfen tekrar giriş yapın.');
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



  //DATE FORMATLAMA İŞLERİ
  formatReservationTime: (reservationTime) => {
    // Backend'den gelen format: "2025-11-25T15:00:00" 
    // Direkt parse et ve göster
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
      APPROVED: 'Rezervasyon Onaylandı',
      REJECTED: 'Reddedildi'
    };
    return statusMap[status] || status;
  },


  
  //REZERVASYONLAR İÇİN STATUS DURUMLARI
  //Geçmiş rezervasyonlar için status text
  getPastReservationStatusText: (status, reservationTime) => {
    // Eğer rezervasyon zamanı geçmişse
    if (reservationService.isReservationPast(reservationTime)) {
      if (status === 'PENDING') {
        return 'İptal Edildi'; 
      }
      if (status === 'APPROVED') {
        return 'Tamamlandı'; 
      }
    }
    // Diğer durumlar için normal status text'i döndür 
    return reservationService.getReservationStatusText(status);
  },

  //Geçmiş rezervasyonlar için status color
  getPastReservationStatusColor: (status, reservationTime) => {
    if (reservationService.isReservationPast(reservationTime)) {
      if (status === 'PENDING') {
        return '#9E9E9E'; 
      }
      if (status === 'APPROVED') {
        return '#4CAF50'; 
      }
    }
    // Diğer durumlar için normal status color'ı döndür
    return reservationService.getReservationStatusColor(status);
  },

  //Normal durumlar için status color
  getReservationStatusColor: (status) => {
    const colorMap = {
      PENDING: '#FFA500',
      APPROVED: '#4CAF50', 
      REJECTED: '#F44336', 
      CANCELLED: '#9E9E9E',
    };
    return colorMap[status] || '#9E9E9E';
  }
};

export default reservationService;