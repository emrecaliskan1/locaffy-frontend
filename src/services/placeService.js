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
  getNearbyPlaces: async (latitude, longitude, radius = 1000) => {
    try {
      const response = await axios.get(`${BASE_URL}/nearby`, {
        params: {
          latitude,
          longitude, 
          radius
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUBLIC 
  getFilteredPlaces: async (placeType, minRating) => {
    try {
      const response = await axios.get(`${BASE_URL}/filter`, {
        params: {
          placeType,
          minRating
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUBLIC
  getPlaceDetails: async (placeId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${placeId}`);
      return response.data;
    } catch (error) {
      throw error;
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