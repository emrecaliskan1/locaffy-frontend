import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/places`;

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

export const placeService = {
  // PUBLIC 
  getNearbyPlaces: async (latitude, longitude, radius = 1000, onlyAvailable = true) => {
    try {
      const response = await axios.get(`${BASE_URL}/nearby`, {
        params: {
          latitude,
          longitude, 
          radius,
          ...(onlyAvailable && { onlyAvailable: true })
        },
        timeout: 8000
      });
      const data = response?.data;
      return Array.isArray(data) ? data : (data?.places ? (Array.isArray(data.places) ? data.places : []) : []);
    } catch (error) {
      return [];
    }
  },

  // PUBLIC 
  getFilteredPlaces: async (placeType, minRating, onlyAvailable = true) => {
    try {
      const response = await axios.get(`${BASE_URL}/filter`, {
        params: {
          placeType,
          minRating,
          ...(onlyAvailable && { onlyAvailable: true })
        },
        timeout: 8000
      });
      const data = response?.data;
      return Array.isArray(data) ? data : (data?.places ? (Array.isArray(data.places) ? data.places : []) : []);
    } catch (error) {
      return [];
    }
  },

  // PUBLIC
  getPlaceDetails: async (placeId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${placeId}`, {
        timeout: 5000
      });
      return response?.data || null;
    } catch (error) {
      return null;
    }
  },

  // BUSINESS OWNER , ADMIN
  updateOccupancyRate: async (placeId, occupancyRate) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.put(`${BASE_URL}/${placeId}/occupancy`, null, {
        params: { occupancyRate },
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default placeService;