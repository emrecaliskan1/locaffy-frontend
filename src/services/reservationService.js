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
      const headers = await buildHeaders();
      const response = await axios.post(`${BASE_URL}`, reservationData, { headers });
      return response.data;
    } catch (error) {
      console.log('Error creating reservation:', error);
      
      // Backend ErrorResponse formatını handle et
      const errorMessage = error.response?.data?.message || 'Rezervasyon oluşturulurken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  // USER - Get user's own reservations
  getMyReservations: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/my`, { headers });
      return response.data;
    } catch (error) {
      console.log('Error fetching reservations:', error);
      
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
  }
};

export default reservationService;