import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/users`;

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

export const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/profile`, { headers });
      return response.data;
    } catch (error) {
      console.log('Error getting profile:', error);
      
      // Backend ErrorResponse formatını handle et
      const errorMessage = error.response?.data?.message || 'Profil bilgileri alınırken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.put(`${BASE_URL}/profile`, userData, { headers });
      return response.data;
    } catch (error) {
      console.log('Error updating profile:', error);
      
      // Backend ErrorResponse formatını handle et
      const errorMessage = error.response?.data?.message || 'Profil güncellenirken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  // Get user's favorite places
  getFavoritePlaces: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/favorites`, { headers });
      return response.data;
    } catch (error) {
      console.log('Error getting favorites:', error);
      
      // Backend ErrorResponse formatını handle et
      const errorMessage = error.response?.data?.message || 'Favori mekanlar yüklenirken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  // Add place to favorites
  addToFavorites: async (placeId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.post(`${BASE_URL}/favorites/${placeId}`, {}, { headers });
      return response.data;
    } catch (error) {
      console.log('Error adding to favorites:', error);
      
      // Backend ErrorResponse formatını handle et
      const errorMessage = error.response?.data?.message || 'Favorilere eklenirken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  // Remove place from favorites
  removeFromFavorites: async (placeId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.delete(`${BASE_URL}/favorites/${placeId}`, { headers });
      return response.data;
    } catch (error) {
      console.log('Error removing from favorites:', error);
      
      // Backend ErrorResponse formatını handle et
      const errorMessage = error.response?.data?.message || 'Favorilerden çıkarılırken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  // Get user statistics (orders, favorites count, etc.)
  getStats: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/stats`, { headers });
      return response.data;
    } catch (error) {
      console.log('Error getting stats:', error);
      
      // Backend ErrorResponse formatını handle et
      const errorMessage = error.response?.data?.message || 'Kullanıcı istatistikleri alınırken bir hata oluştu';
      throw new Error(errorMessage);
    }
  }
};

export default userService;