import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/admin`;

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (e) {
    return null;
  }
};

const buildHeaders = async () => {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const adminService = {
  
  // TÜM ENDPOINTLER ADMIN YETKİSİ GEREKTİRİR.
  getAllPlaces: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/places`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePlace: async (placeId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.delete(`${BASE_URL}/places/${placeId}`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  togglePlaceStatus: async (placeId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.put(`${BASE_URL}/places/${placeId}/toggle-status`, {}, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/users`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  toggleUserStatus: async (userId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.put(`${BASE_URL}/users/${userId}/toggle-status`, {}, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default adminService;