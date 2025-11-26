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

  getProfile: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/profile`, { headers });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profil bilgileri alınırken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  updateProfile: async (userData) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.put(`${BASE_URL}/profile`, userData, { headers });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profil güncellenirken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  getFavoritePlaces: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/favorites`, { headers });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Favori mekanlar yüklenirken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  addToFavorites: async (placeId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.post(`${BASE_URL}/favorites/${placeId}`, {}, { headers });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Favorilere eklenirken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  removeFromFavorites: async (placeId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.delete(`${BASE_URL}/favorites/${placeId}`, { headers });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Favorilerden çıkarılırken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  getStats: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/stats`, { headers });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Kullanıcı istatistikleri alınırken bir hata oluştu';
      throw new Error(errorMessage);
    }
  }
};

export default userService;