import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/reviews`;

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

export const reviewService = {
    
  // USER
  createReview: async (reviewData) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.post(`${BASE_URL}`, reviewData, { headers });
      return response.data;
    } catch (error) {
      let errorMessage = 'Yorum oluşturulurken bir hata oluştu';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      throw new Error(errorMessage);
    }
  },

  // PUBLIC 
  getPlaceReviews: async (placeId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/place/${placeId}`, { headers });
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        return [];
      }
      return [];
    }
  },

  // USER
  deleteReview: async (reviewId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.delete(`${BASE_URL}/${reviewId}`, { headers });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Yorum silinirken bir hata oluştu';
      throw new Error(errorMessage);
    }
  }
};

export default reviewService;