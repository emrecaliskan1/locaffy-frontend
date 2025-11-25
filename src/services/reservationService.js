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
  // USER - Create new reservation
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

  // USER - Get user's own reservations  
  getUserReservations: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/my-reservations`, { headers });
      return response.data;
    } catch (error) {
      // Backend ErrorResponse formatını handle et
      const errorMessage = error.response?.data?.message || 'Rezervasyonlar yüklenirken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  // BUSINESS OWNER - Update reservation status
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

  // BUSINESS OWNER - Get place reservations
  getPlaceReservations: async (placeId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/place/${placeId}`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Helper function to check if reservation is in the past
  isReservationPast: (reservationTime) => {
    // Backend'den gelen format: "2025-11-25T15:00:00"
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

  // Helper function to format reservation time for display
  formatReservationTime: (reservationTime) => {
    // Backend'den gelen format: "2025-11-25T15:00:00" 
    // Direkt parse et ve göster
    let dateStr = reservationTime;
    
    // ISO string ise T'yi böl
    if (dateStr.includes('T')) {
      const [datePart, timePart] = dateStr.split('T');
      const [year, month, day] = datePart.split('-');
      const [hour, minute] = timePart.split(':');
      
      return `${day}.${month}.${year} ${hour}:${minute}`;
    }
    
    // Fallback - normal Date parse
    const date = new Date(reservationTime);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Helper function to get reservation status text in Turkish
  getReservationStatusText: (status) => {
    const statusMap = {
      PENDING: 'Beklemede',
      APPROVED: 'Rezervasyon Onaylandı',
      REJECTED: 'Reddedildi',
      CANCELLED: 'İptal Edildi',
    };
    return statusMap[status] || status;
  },

  // Helper function to get reservation status color
  getReservationStatusColor: (status) => {
    const colorMap = {
      PENDING: '#FFA500', // Orange/Yellow
      APPROVED: '#4CAF50', // Green  
      REJECTED: '#F44336', // Red
      CANCELLED: '#9E9E9E', // Gray
    };
    return colorMap[status] || '#9E9E9E';
  }
};

export default reservationService;